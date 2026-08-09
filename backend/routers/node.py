from fastapi import APIRouter
from services.nodes_service import get_node_data
from schemas.node import NodeResponse

router = APIRouter()


@router.get("/nodes", response_model=list[NodeResponse])
def get_nodes():
    return get_node_data()