deployment_data=[
  {
    "name": "frontend",
    "namespace": "default",
    "replicas": 3,
    "availableReplicas": 3,
    "status": "Running"
  },
  {
    "name": "backend",
    "namespace": "default",
    "replicas": 2,
    "availableReplicas": 2,
    "status": "Running"
  },
  {
    "name": "redis",
    "namespace": "cache",
    "replicas": 1,
    "availableReplicas": 1,
    "status": "Running"
  }
]
def get_deployment_data():
    return deployment_data
def restart_deployment_service(deployment_name: str):
        return {"message": f"Restart requested for {deployment_name}"}
    
def scale_up_deployment_service(deployment_name:str):
    for deployment in deployment_data:
                      if deployment["name"] ==deployment_name:
                          print(f"scale up the deployment {deployment_name}")
                          deployment["replicas"]+=1
                          break
    return {"message":f"Deployment Scaled up sucessfully"}

def scale_down_deployment_service(deployment_name:str):
    for deployment in deployment_data:
                      if deployment["name"] ==deployment_name:
                          print(f"scale up the deployment {deployment_name}")
                          deployment["replicas"]-=1
                          break
    return {"message":f"Deployment Scaled up sucessfully"}
