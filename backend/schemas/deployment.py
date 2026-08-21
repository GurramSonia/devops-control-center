from pydantic import BaseModel

class DeploymentResponse(BaseModel):
    name: str
    namespace: str
    replicas: int
    availableReplicas: int
    status: str
class ScaleRequest(BaseModel):
    name: str
    newReplicas: int
    namespace: str