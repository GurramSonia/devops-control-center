from pydantic import BaseModel

class DeploymentResponse(BaseModel):
    name: str
    namespace: str
    replicas: int
    availableReplicas: int
    status: str
class ScaleRequest(BaseModel):
    newReplicas: int