from fastapi import APIRouter
from services.pods_service import get_pod_data, restart_pod_service 
from schemas.pod import PodResponse, PodRestartRequest
router1 = APIRouter()
router2 = APIRouter()


@router1.get("/pods",response_model=list[PodResponse])
def get_pods():
    return get_pod_data()

@router2.post("/pods/{pod_name}/restart")
def restart_pod(pod_name: str):
    return restart_pod_service(pod_name=pod_name)