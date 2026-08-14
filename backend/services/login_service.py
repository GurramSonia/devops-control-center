from schemas.login import LoginRequest, LoginResponse
from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext
import jwt
import time
import secrets

security = HTTPBearer()

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

SECRET_KEY = "replace-with-a-long-random-secret"
ALGORITHM = "HS256"

USER_DB = {     
    "admin@example.com": pwd_context.hash("admin123"),
    "sonia@example.com": pwd_context.hash("sonia123"),
}

def create_token(email: str) -> str:
    payload = {
        "sub": email,
        "iat": time.time(),
        "exp": time.time() + 3600
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return token


def get_login_data(payload: LoginRequest) -> LoginResponse:
    email = payload.email.strip().lower()

    stored_hash= USER_DB.get(email)

    if  not stored_hash  or not pwd_context.verify(payload.password, stored_hash):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )
 
    return {
        "token": create_token(email),
        "message": "Login successful"
    }

def get_current_user(creds: HTTPAuthorizationCredentials = Depends(security)):
    token = creds.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload["sub"]
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")


def get_profile(email: str = Depends(get_current_user)):
    return {"email": email}