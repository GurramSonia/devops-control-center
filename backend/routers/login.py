from fastapi import APIRouter, Depends
from services.login_service import get_current_user, get_login_data
from schemas.login import  LoginResponse, LoginRequest 

router1 = APIRouter()
router2 = APIRouter()

@router1.post("/login",response_model=LoginResponse)
def get_login(payload: LoginRequest):
    return get_login_data(payload)

@router2.get("/profile")
def profile():
    return get_profile()

