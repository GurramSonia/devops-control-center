export interface deploymentData{
    name: string;
    namespace: string;
    replicas: number;
    availableReplicas: number;
    status: string;
}