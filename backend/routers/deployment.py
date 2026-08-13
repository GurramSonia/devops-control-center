from fastapi import APIRouter
from services.deployment_service import get_deployment_data,restart_deployment_service,scale_replicas_service
from schemas.deployment import DeploymentResponse,ScaleRequest
router1 = APIRouter()
router2=APIRouter()
router3=APIRouter()
router4=APIRouter()
from fastapi import HTTPException 




@router1.get("/deployments",response_model=list[DeploymentResponse])
def get_deployments():
    return get_deployment_data()

@router2.post("/deployments/{deployment_name}")
def restart_deployment(deployment_name:str):
            return restart_deployment_service(deployment_name)
    
@router3.post("/deployments/{deployment_name}/scale")
def scale_deployment(deployment_name:str, payload: ScaleRequest):
            if payload.newReplicas < 0:
                 raise HTTPException(status_code=400, detail="replicas must be non-negative")
            result = scale_replicas_service(deployment_name, int(payload.newReplicas))
            if result is None:
                raise HTTPException(status_code=404, detail="Deployment not found")
            return result

