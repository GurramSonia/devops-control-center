pod_data = [
        {
            "name":"frontend",
            "namespace":"default",
            "status":"pending",
            "restarts":0
        },
        {
            "name":"backend",
            "namespace":"default",
            "status":"failed",
            "restarts":1
        }
    ]
def get_pod_data():
    return pod_data

def restart_pod_service(pod_name: str):
    for pod in pod_data:
        if pod["name"] == pod_name:
            print(f"Restarting pod: {pod_name}")
            pod["status"] = "pending" or "failed"
            pod["restarts"] += 1
            break
    return {"message": f"Restart requested for {pod_name}"}