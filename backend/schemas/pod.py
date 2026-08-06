from pydantic import BaseModel

class PodResponse(BaseModel):
    name: str
    namespace: str
    status: str
    restarts: int
class PodRestartRequest(BaseModel):
    name: str
    