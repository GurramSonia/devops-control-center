import type { DashboardData } from "../types/dashboard";

export async function getDashboardData(): Promise<DashboardData> {
  const token = localStorage.getItem("token");
    const response = await fetch("http://127.0.0.1:8001/dashboard",{
  headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
    const body = await response.json().catch(() => null);
    const message =
      body?.detail ||
      (await response.text()) ||
      "Failed to fetch deployment data";
    throw new Error(message);
  }

    return response.json();
}