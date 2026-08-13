import type { deploymentData } from "../types/deployment";


export async function getDeploymentData(): Promise<deploymentData[]> {
   const token = localStorage.getItem("token");
    const response = await fetch("http://127.0.0.1:8001/deployments", {
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

export async function restartDeployment(name: string) {
  const response = await fetch(`http://127.0.0.1:8001/deployments/${name}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    throw new Error("Failed to restart Deployment");
  }


  return response.json();
}

export async function scaleDeployment(name: string, newReplicas: number) {
  const response = await fetch(`http://127.0.0.1:8001/deployments/${name}/scale`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ newReplicas }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to scale deployment: ${response.status} ${text}`);
  }

  return response.json();
}