from typing import Optional, Dict
import os
from pathlib import Path
from kubernetes import client, config
from kubernetes.config.config_exception import ConfigException

def get_k8s_clients(kubeconfig_path: Optional[str] = None) -> Dict[str, object]:
    """
    Load Kubernetes config and return ApiClient + common API wrappers.
    Tries in-cluster first, then KUBECONFIG env, then ~/.kube/config.
    """
    try:
        config.load_incluster_config()
    except ConfigException:
        kubeconfig = (
            kubeconfig_path
            or os.environ.get("KUBECONFIG")
            or str(Path.home() / ".kube" / "config")
        )
        config.load_kube_config(config_file=kubeconfig)

    api_client = client.ApiClient()
    return {
        "api_client": api_client,
        "core_v1": client.CoreV1Api(api_client),
        "apps_v1": client.AppsV1Api(api_client),
        "custom_objects": client.CustomObjectsApi(api_client),
    }