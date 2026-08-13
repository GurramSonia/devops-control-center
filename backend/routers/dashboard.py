from fastapi import APIRouter
from services.dashboard_service import get_dashboard_data 
from schemas.dashboard import DashboardResponse  

router = APIRouter()

@router.get("/dashboard",response_model=DashboardResponse)
def get_dashboard():
    return get_dashboard_data()
