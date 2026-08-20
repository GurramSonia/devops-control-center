from fastapi import APIRouter
from fastapi import APIRouter, Depends
from services.auth_service import get_current_user, require_permission
from services.nodes_service import get_node_data
from schemas.node import NodeResponse

router = APIRouter()


@router.get("/nodes", response_model=list[NodeResponse])
def get_nodes(current_user: dict = Depends(
        require_permission("view")
    )
):
    return get_node_data()