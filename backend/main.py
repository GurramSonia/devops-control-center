from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.dashboard import router as dashboard_router
from routers.pod import router1 as pod_get_router
from routers.pod import router2 as pod_restart_router  
from routers.deployment import router1 as deployment_router
from routers.deployment import router2 as deployment_restart_router
from routers.deployment import router3 as Scale_deployment_router


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
app.include_router(deployment_router)
app.include_router(deployment_restart_router)
app.include_router(Scale_deployment_router)

@app.get("/")
def home():
    return{"message":"Welcome to DevOps Control Center"}