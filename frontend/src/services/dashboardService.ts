import type { DashboardData } from "../types/dashboard";

export async function getDashboardData(): Promise<DashboardData> {
    const response = await fetch("http://127.0.0.1:8001/dashboard");

    if (!response.ok) {
        throw new Error("Failed to fetch dashboard data");
    }

    return response.json();
}