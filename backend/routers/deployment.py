from fastapi import APIRouter
from services.deployment_service import get_deployment_data,restart_deployment_service,scale_down_deployment_service,scale_up_deployment_service
from schemas.deployment import DeploymentResponse
router1 = APIRouter()
router2=APIRouter()
router3=APIRouter()
router4=APIRouter()



@router1.get("/deployments",response_model=list[DeploymentResponse])
def get_deployments():
    return get_deployment_data()

@router2.post("/deployments/{deployment_name}/{action}")
def restart_deployment(deployment_name:str, action: str):
    if action == "restart":
            return restart_deployment_service(deployment_name)
    if action == "scale-up":
            return scale_up_deployment_service(deployment_name)
    if action == "scale-down":
            return scale_down_deployment_service(deployment_name)


