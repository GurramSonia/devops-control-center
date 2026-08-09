
# pod_data = [
#         {
#             "name":"frontend",
#             "namespace":"default",
#             "status":"pending",
#             "restarts":0
#         },
#         {
#             "name":"backend",
#             "namespace":"default",
#             "status":"failed",
#             "restarts":1
#         },
#          {
#             "name":"mysql",
#             "namespace":"database",
#             "status":"failed",
#             "restarts":4
#         },

#         {
#                     "name":"mongodb",
#                     "namespace":"database",
#                     "status":"failed",
#                     "restarts":4
#         },
#     ]
# def get_pod_data():
#     return pod_data

# def restart_pod_service(pod_name: str):
#     for pod in pod_data:
#         if pod["name"] == pod_name:
#             print(f"Restarting pod: {pod_name}")
#             pod["status"] = "pending" or "failed"
#             pod["restarts"] += 1
#             break
#     return {"message": f"Restart requested for {pod_name}"}





from kubernetes_folder.kubernetes_client import get_k8s_clients
from typing import List, Dict, Optional
from kubernetes.client.rest import ApiException
from fastapi import HTTPException

# keep a small local fallback for when K8s can't be reached
_fallback_pod_data = [
    {"name": "frontend", "namespace": "default", "status": "pending", "restarts": 0},
    {"name": "backend", "namespace": "default", "status": "failed", "restarts": 1},
    {"name": "mysql", "namespace": "database", "status": "failed", "restarts": 4},
    {"name": "mongodb", "namespace": "database", "status": "failed", "restarts": 4},
]

# initialize clients once; get_k8s_clients should handle kubeconfig/in-cluster config
try:
   # _clients = get_k8s_clients(r"C:\Users\sonia\.kube\config")
    _clients = get_k8s_clients(r"C:\Users\sonia\.kube\config")
except Exception as e:
    print("Failed to initialize k8s clients:", e)
    _clients = None

def _map_pod(pod) -> Dict:
    name = pod.metadata.name
    ns = pod.metadata.namespace
    phase = (pod.status.phase or "Unknown").lower()
    restarts = 0
    if pod.status.container_statuses:
        restarts = sum((cs.restart_count or 0) for cs in pod.status.container_statuses)
    return {"name": name, "namespace": ns, "status": phase, "restarts": restarts}

def get_pod_data(namespace: Optional[str] = None) -> List[Dict]:
    """
    Return a list of pod dicts: {name, namespace, status, restarts}.
    If `namespace` is provided, returns pods only from that namespace.
    Falls back to static data if K8s is unreachable.
    """
    if not _clients:
        return _fallback_pod_data
        #raise HTTPException(status_code=503, detail="Kubernetes connection unavailable")

    try:
        core = _clients["core_v1"]
        if namespace:
            pod_list = core.list_namespaced_pod(namespace)
        else:
            pod_list = core.list_pod_for_all_namespaces()
        return [_map_pod(p) for p in pod_list.items]
    except ApiException as e:
        print("Kubernetes API error when listing pods:", e)
        return _fallback_pod_data
    except Exception as e:
        print("Unexpected error when listing pods:", e)
        return _fallback_pod_data

def restart_pod_service(pod_name: str) -> Dict:
    """
    Restart a pod by locating it (across namespaces) and deleting it.
    Controller (Deployment/ReplicaSet) will recreate the pod.
    """
    # fallback behavior for static data (keeps old interface)
    if not _clients:
        for pod in _fallback_pod_data:
            if pod["name"] == pod_name:
                pod["status"] = "pending"
                pod["restarts"] += 1
                break
        return {"message": f"Restart requested for {pod_name}"}

    try:
        core = _clients["core_v1"]
        # find the pod (search all namespaces)
        pods = core.list_pod_for_all_namespaces().items
        target = next((p for p in pods if p.metadata.name == pod_name), None)
        if not target:
            return {"error": "Pod not found", "pod": pod_name}

        ns = target.metadata.namespace
        core.delete_namespaced_pod(name=pod_name, namespace=ns)
        return {"message": f"Restart requested for {pod_name} in namespace {ns}"}
    except ApiException as e:
        print("Kubernetes API error when deleting pod:", e)
        return {"error": str(e)}
    except Exception as e:
        print("Unexpected error when restarting pod:", e)
        return {"error": str(e)}


def get_pod_logs_service(pod_name: str, namespace: str) -> str:
    if not _clients:
        return f"Fallback logs for {pod_name} in namespace {namespace}"

    try:
        core = _clients["core_v1"]
        return core.read_namespaced_pod_log(
            name=pod_name,
            namespace=namespace,
            tail_lines=200,
            timestamps=True,
        )
    
    except ApiException as e:
        if getattr(e, "status", None) == 404:
            return ""
        raise HTTPException(
            status_code=e.status if getattr(e, "status", None) else 500,
            detail=str(e),
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


