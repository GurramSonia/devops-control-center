from fastapi import APIRouter, Depends
from services.auth_service import get_current_user, require_permission, require_roles
from services.pods_service import get_pod_data, restart_pod_service,get_pod_logs_service 
from schemas.pod import PodResponse, PodRestartRequest
from fastapi.responses import PlainTextResponse
from services.auth_service import get_current_user, require_roles

router1 = APIRouter()
router2 = APIRouter()
router3 =APIRouter()


@router1.get("/pods",response_model=list[PodResponse])
def get_pods(current_user: dict = Depends(
        require_permission("view")
    )
):
    return get_pod_data()

@router2.post("/pods/{pod_name}/restart")
def restart_pod(
    pod_name: str,
   
    current_user: dict =Depends(require_permission("restart_pod"))):
    return restart_pod_service(pod_name=pod_name)

@router3.get("/pods/{pod_name}/logs",response_class=PlainTextResponse)
def get_pod_logs(pod_name: str, namespace: str):
    return get_pod_logs_service(pod_name=pod_name, namespace=namespace)