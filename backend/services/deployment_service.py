# deployment_data=[
#   {
#     "name": "frontend",
#     "namespace": "default",
#     "replicas": 3,
#     "availableReplicas": 3,
#     "status": "Running"
#   },
#   {
#     "name": "backend",
#     "namespace": "default",
#     "replicas": 2,
#     "availableReplicas": 2,
#     "status": "Running"
#   },
#   {
#     "name": "redis",
#     "namespace": "cache",
#     "replicas": 1,
#     "availableReplicas": 1,
#     "status": "Running"
#   }
# ]
# def get_deployment_data():
#     return deployment_data
# def restart_deployment_service(deployment_name: str):
#         return {"message": f"Restart requested for {deployment_name}"}
    
# def scale_replicas_service(deployment_name:str,replicas: int):
#     for d in deployment_data:
#         if d["name"] == deployment_name:
#             d["replicas"] = replicas
#             d["availableReplicas"] = min(d.get("availableReplicas", 0), replicas)
#             break
#     return {"message": "Scaled successfully", "replicas": replicas}



from typing import List, Dict, Optional
from kubernetes.client.rest import ApiException
from kubernetes_folder.kubernetes_client import get_k8s_clients
from datetime import datetime

# fallback static data
deployment_data = [
    {
        "name": "frontend",
        "namespace": "default",
        "replicas": 3,
        "availableReplicas": 3,
        "status": "Running",
    },
    {
        "name": "backend",
        "namespace": "default",
        "replicas": 2,
        "availableReplicas": 2,
        "status": "Running",
    },
    {
        "name": "redis",
        "namespace": "cache",
        "replicas": 1,
        "availableReplicas": 1,
        "status": "Running",
    },
]

# init k8s clients (will use provided kubeconfig path)
try:
    # _clients = get_k8s_clients(r"C:\Users\sonia\.kube\config")
    _clients = get_k8s_clients()
except Exception as e:
    print("Failed to initialize k8s clients:", e)
    _clients = None


def _map_deployment(dep) -> Dict:
    name = dep.metadata.name
    ns = dep.metadata.namespace
    spec_replicas = getattr(dep.spec, "replicas", 0) or 0
    status_available = getattr(dep.status, "available_replicas", 0) or 0
    # status: best-effort string from conditions or 'Unknown'
    status = getattr(dep.status, "conditions", None)
    status_str = "Unknown"
    if dep.status and getattr(dep.status, "available_replicas", None) is not None:
        status_str = "Running" if dep.status.available_replicas > 0 else "NotReady"
    return {
        "name": name,
        "namespace": ns,
        "replicas": spec_replicas,
        "availableReplicas": status_available,
        "status": status_str,
    }


def get_deployment_data(namespace: Optional[str] = None) -> List[Dict]:
    """
    Return list of deployments: {name, namespace, replicas, availableReplicas, status}.
    If `namespace` provided, list only that namespace.
    Falls back to static `deployment_data` if cluster access fails.
    """
    if not _clients:
        return deployment_data

    try:
        apps = _clients["apps_v1"]
        if namespace:
            resp = apps.list_namespaced_deployment(namespace=namespace)
        else:
            resp = apps.list_deployment_for_all_namespaces()
        return [_map_deployment(d) for d in resp.items]
    except ApiException as e:
        print("Kubernetes API error when listing deployments:", e)
        return deployment_data
    except Exception as e:
        print("Unexpected error when listing deployments:", e)
        return deployment_data


def restart_deployment_service(deployment_name: str) -> Dict:
    """
    Trigger a rollout restart by patching pod-template annotation `kubectl.kubernetes.io/restartedAt`.
    Searches across namespaces for a deployment with the given name.
    """
    if not _clients:
        # fallback: note the request
        return {"message": f"Restart requested for {deployment_name}"}

    try:
        apps = _clients["apps_v1"]
        # find deployment across namespaces
        all_deps = apps.list_deployment_for_all_namespaces().items
        target = next((d for d in all_deps if d.metadata.name == deployment_name), None)
        if not target:
            return {"error": "Deployment not found", "deployment": deployment_name}

        ns = target.metadata.namespace
        ts = datetime.utcnow().isoformat() + "Z"
        patch_body = {
            "spec": {
                "template": {
                    "metadata": {
                        "annotations": {"kubectl.kubernetes.io/restartedAt": ts}
                    }
                }
            }
        }
        apps.patch_namespaced_deployment(name=deployment_name, namespace=ns, body=patch_body)
        return {"message": f"Restart requested for {deployment_name} in namespace {ns}"}
    except ApiException as e:
        print("Kubernetes API error when restarting deployment:", e)
        return {"error": str(e)}
    except Exception as e:
        print("Unexpected error when restarting deployment:", e)
        return {"error": str(e)}


def scale_replicas_service(deployment_name: str, replicas: int) -> Optional[Dict]:
    """
    Set the deployment's replica count to `replicas`.
    Returns a message or None (if not found).
    """
    if replicas < 0:
        return {"error": "replicas must be non-negative"}

    if not _clients:
        # update fallback data
        for d in deployment_data:
            if d["name"] == deployment_name:
                d["replicas"] = replicas
                d["availableReplicas"] = min(d.get("availableReplicas", 0), replicas)
                break
        return {"message": "Scaled (fallback)", "replicas": replicas}

    try:
        apps = _clients["apps_v1"]
        # find deployment across namespaces
        all_deps = apps.list_deployment_for_all_namespaces().items
        target = next((d for d in all_deps if d.metadata.name == deployment_name), None)
        if not target:
            return None
        ns = target.metadata.namespace
        patch_body = {"spec": {"replicas": replicas}}
        apps.patch_namespaced_deployment(name=deployment_name, namespace=ns, body=patch_body)
        return {"message": "Scaled successfully", "replicas": replicas}
    except ApiException as e:
        print("Kubernetes API error when scaling deployment:", e)
        return {"error": str(e)}
    except Exception as e:
        print("Unexpected error when scaling deployment:", e)
        return {"error": str(e)}

