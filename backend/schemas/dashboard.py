from pydantic import BaseModel

class DashboardResponse(BaseModel):
    clusterStatus: str
    runningPods: int
    failedPods: int
    deployments: int
    cpuUsage: int
    memoryUsage: int