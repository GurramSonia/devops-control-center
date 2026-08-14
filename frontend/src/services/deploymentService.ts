import type { deploymentData } from "../types/deployment";
import { apiFetch } from "./apiFetch";


export async function getDeploymentData(): Promise<deploymentData[]> {
   const response = await apiFetch("/deployments");
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

export async function restartDeployment(name: string) {
  const response = await apiFetch(
    `/deployments/${name}/restart`,
    {
      method: "POST",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to restart Deployment");
  }


  return response.json();
}

export async function scaleDeployment(name: string, newReplicas: number) {
 const response = await apiFetch(
    `/deployments/${name}/scale`,
    {
      method: "POST",
      body: JSON.stringify({
        replicas: newReplicas,
      }),
    }
  );
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to scale deployment: ${response.status} ${text}`);
  }

  return response.json();
}