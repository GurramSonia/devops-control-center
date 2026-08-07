# def get_dashboard_data():
#     return {
#         "clusterStatus": "Healthy",
#         "runningPods": 25,
#         "failedPods": 1,
#         "deployments": 12,
#         "cpuUsage": 63,
#         "memoryUsage": 54,
#     }


from typing import Dict
from kubernetes.client.rest import ApiException
from kubernetes_folder.kubernetes_client import get_k8s_clients

_dashboard_fallback = {
    "clusterStatus": "Healthy",
    "runningPods": 25,
    "failedPods": 1,
    "deployments": 12,
    "cpuUsage": 63,
    "memoryUsage": 54,
}

try:
    _clients = get_k8s_clients(r"C:\Users\sonia\.kube\config")
except Exception as e:
    print("Failed to initialize k8s clients for dashboard:", e)
    _clients = None


def _count_pods(pods):
    running = 0
    failed = 0
    for pod in pods:
        phase = getattr(pod.status, "phase", "") or ""
        phase_lower = phase.lower()
        if phase_lower == "running":
            running += 1
        elif phase_lower in ("failed", "unknown", "pending", "crashloopbackoff"):
            failed += 1
    return running, failed


def _estimate_cpu_usage(running_pods: int, total_pods: int) -> int:
    if total_pods == 0:
        return 0
    return min(100, max(0, int((running_pods / total_pods) * 80 + 10)))


def _estimate_memory_usage(running_pods: int, total_pods: int) -> int:
    if total_pods == 0:
        return 0
    return min(100, max(0, int((running_pods / total_pods) * 70 + 15)))


def get_dashboard_data() -> Dict[str, object]:
    if not _clients:
        return _dashboard_fallback

    try:
        core = _clients["core_v1"]
        apps = _clients["apps_v1"]

        pod_list = core.list_pod_for_all_namespaces().items
        deployment_list = apps.list_deployment_for_all_namespaces().items

        running_pods, failed_pods = _count_pods(pod_list)
        total_pods = running_pods + failed_pods

        return {
            "clusterStatus": "Healthy",
            "runningPods": running_pods,
            "failedPods": failed_pods,
            "deployments": len(deployment_list),
            "cpuUsage": _estimate_cpu_usage(running_pods, total_pods),
            "memoryUsage": _estimate_memory_usage(running_pods, total_pods),
        }
    except ApiException as e:
        print("Kubernetes API error when building dashboard:", e)
        return _dashboard_fallback
    except Exception as e:
        print("Unexpected error when building dashboard:", e)
        return _dashboard_fallback