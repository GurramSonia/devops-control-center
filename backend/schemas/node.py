from pydantic import BaseModel

class NodeResponse(BaseModel):
    name: str
    status: str
    roles: str
    cpu: str
    memory:str
    version: str
    osImage: str
    arch: str
    