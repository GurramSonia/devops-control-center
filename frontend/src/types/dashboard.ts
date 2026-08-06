export interface DashboardData {
    clusterStatus: string;
    runningPods: number;
    failedPods: number;
    deployments: number;
    cpuUsage: number;
    memoryUsage: number;
}