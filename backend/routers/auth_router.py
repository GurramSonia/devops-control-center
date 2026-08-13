from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database.database import get_db
from schemas.login import LoginRequest, LoginResponse
from services.auth_service import authenticate_user, create_access_token


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/login", response_model=LoginResponse)
def login(
    payload: LoginRequest,
    db: Session = Depends(get_db)
):
    user = authenticate_user(
        db,
        payload.email,
        payload.password
    )

    token = create_access_token(user.email)

    return {
        "token": token,
        "message": "Login successful"
    }