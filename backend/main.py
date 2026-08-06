from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.dashboard import router as dashboard_router
from routers.pod import router1 as pod_get_router
from routers.pod import router2 as pod_restart_router   

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(dashboard_router)
app.include_router(pod_get_router)
app.include_router(pod_restart_router)

@app.get("/")
def home():
    return{
"message":"Welcome to DevOps Control Center"
    }