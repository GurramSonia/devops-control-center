from fastapi import APIRouter, Depends
from services.auth_service import get_current_user
from services.dashboard_service import get_dashboard_data 
from schemas.dashboard import DashboardResponse  

router = APIRouter()

@router.get("/dashboard",response_model=DashboardResponse)
def get_dashboard(current_user: str = Depends(get_current_user)):
    return get_dashboard_data()
