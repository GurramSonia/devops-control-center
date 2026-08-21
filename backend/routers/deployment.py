from fastapi import APIRouter
from fastapi import APIRouter, Depends
from database.database import get_db
from services.auth_service import get_current_user, require_permission, require_roles
from services.deployment_service import get_deployment_data,restart_deployment_service,scale_replicas_service, get_deployment_by_name
from schemas.deployment import DeploymentResponse,ScaleRequest
router1 = APIRouter()
router2=APIRouter()
router3=APIRouter()
router4=APIRouter()
from fastapi import HTTPException 
from sqlalchemy.orm import Session
from services.audit_service import create_audit_log




@router1.get("/deployments",response_model=list[DeploymentResponse])
def get_deployments(current_user: dict = Depends(
        require_permission("view")
    )
):
    return get_deployment_data()

@router2.post("/deployments/{deployment_name}")
def restart_deployment(deployment_name:str, 
            current_user: dict = Depends(require_permission("restart_deployment"))):
            return restart_deployment_service(deployment_name)
    
@router3.post("/deployments/{deployment_name}/scale")
def scale_deployment(deployment_name:str,
                    payload: ScaleRequest, 
                    current_user: dict = Depends(require_permission("scale_deployment")
                    ),db: Session = Depends(get_db)
                    
                    ):


        if payload.newReplicas < 0:
            raise HTTPException(
            status_code=400,
            detail="replicas must be non-negative"
        )

        try:

            deployment = get_deployment_by_name(
            deployment_name,
            payload.namespace
            )

            if deployment is None:
                raise HTTPException(
                    status_code=404,
                    detail="Deployment not found"
            )

        # Store the old replica count
            old_replicas = deployment["replicas"]

            result = scale_replicas_service(
            deployment_name,
            int(payload.newReplicas)
        )

            if result is None:
                raise HTTPException(
                    status_code=404,
                    detail="Deployment not found"
                )

            create_audit_log(
            db=db,
            user_email=current_user["email"],
            user_role=current_user["role"],
            action="scale_deployment",
            resource_type="deployment",
            resource_name=deployment_name,
            namespace=str(payload.namespace),
            status="success",
            details=f"Scaled from {old_replicas} to {payload.newReplicas} replicas"
        )

            return result

        except HTTPException:
             raise

        except Exception as e:

            create_audit_log(
            db=db,
            user_email=current_user["email"],
            user_role=current_user["role"],
            action="scale_deployment",
            resource_type="deployment",
            resource_name=deployment_name,
            namespace=str(payload.namespace),
            status="failed",
            details=str(e)
        )

        raise

