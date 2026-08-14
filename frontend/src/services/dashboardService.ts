import type { DashboardData } from "../types/dashboard";
import { apiFetch } from "./apiFetch";

export async function getDashboardData(): Promise<DashboardData> {
  const response = await apiFetch("/dashboard");

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