from typing import List, Dict
from kubernetes_folder.kubernetes_client import get_k8s_clients
from kubernetes.client.rest import ApiException
from fastapi import HTTPException


try:
    _clients = get_k8s_clients(r"C:\Users\sonia\.kube\config")
except Exception as e:
    print("Failed to initialize k8s clients for nodes:", e)
    _clients = None


def _node_roles(labels: dict) -> str:
    if not labels:
        return "none"
    roles = [
        label.split("/")[-1]
        for label in labels
        if label.startswith("node-role.kubernetes.io/")
    ]
    return " ".join(sorted(roles)) or "none"


def _resource_value(resources: dict, key: str) -> str:
    if not resources:
        return "unknown"
    return resources.get(key, "unknown")

def _map_node(node) -> Dict:
    metadata = node.metadata
    status = node.status
    conditions = getattr(status, "conditions", []) or []
    ready_condition = next((c for c in conditions if c.type == "Ready"), None)
    ready_status = (
        "Ready" if ready_condition and ready_condition.status == "True" else "NotReady"
    )

    node_info = getattr(status, "node_info", None)
    version = getattr(node_info, "kubelet_version", "unknown") if node_info else "unknown"
    os_image = getattr(node_info, "os_image", "unknown") if node_info else "unknown"
    architecture = getattr(node_info, "architecture", "unknown") if node_info else "unknown"

    return {
        "name": metadata.name,
        "status": ready_status,
        "roles": _node_roles(getattr(metadata, "labels", {})),
        "cpu": _resource_value(getattr(status, "allocatable", {}) or {}, "cpu"),
        "memory": _resource_value(getattr(status, "allocatable", {}) or {}, "memory"),
        "version": version,
        "osImage": os_image,
        "arch": architecture,
    }


def get_node_data() -> List[Dict]:
    if not _clients:
         raise HTTPException(status_code=503, detail="Kubernetes connection unavailable")

    try:
        core = _clients["core_v1"]
        node_list = core.list_node().items
        return [_map_node(node) for node in node_list]
    except ApiException as e:
        print("Kubernetes API error when listing nodes:", e)
        raise HTTPException(status_code=503, detail="Kubernetes connection unavailable")
    except Exception as e:
        print("Unexpected error when listing nodes:", e)
        raise HTTPException(status_code=500, detail=str(e))