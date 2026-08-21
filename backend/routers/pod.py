from fastapi import APIRouter, Depends
from services.auth_service import get_current_user, require_permission, require_roles
from services.pods_service import get_pod_data, restart_pod_service,get_pod_logs_service 
from schemas.pod import PodResponse, PodRestartRequest
from fastapi.responses import PlainTextResponse
from services.auth_service import get_current_user, require_roles
from sqlalchemy.orm import Session

from database.database import get_db
from services.audit_service import create_audit_log

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
    namespace: str,
    current_user: dict =Depends(require_permission("restart_pod")),
    db: Session = Depends(get_db)
    ):


    try:
        result = restart_pod_service(
            pod_name=pod_name,
            namespace=namespace
        )

        create_audit_log(
            db=db,
            user_email=current_user["email"],
            user_role=current_user["role"],
            action="restart_pod",
            resource_type="pod",
            resource_name=pod_name,
            namespace=namespace,
            status="success",
        )

        return result

    except Exception as e:

        create_audit_log(
            db=db,
            user_email=current_user["email"],
            user_role=current_user["role"],
            action="restart_pod",
            resource_type="pod",
            resource_name=pod_name,
            namespace=namespace,
            status="failed",
            details=str(e),
        )

        raise
    # create_audit_log(
    #     db=db,
    #     user_email=current_user["email"],
    #     user_role=current_user["role"],
    #     action="restart_pod",
    #     resource_type="pod",
    #     resource_name=pod_name,
    #     namespace=namespace,
    #     status="success",
    # )
    # return restart_pod_service(pod_name=pod_name,namespace=namespace)

@router3.get("/pods/{pod_name}/logs",response_class=PlainTextResponse)
def get_pod_logs(pod_name: str, namespace: str):
    return get_pod_logs_service(pod_name=pod_name, namespace=namespace)