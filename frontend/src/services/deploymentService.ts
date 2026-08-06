import type { deploymentData } from "../types/deployment";


export async function getDeploymentData(): Promise<deploymentData[]> {
    const response = await fetch("http://127.0.0.1:8000/deployments");

    if (!response.ok) {
        throw new Error("Failed to fetch Deployment data");
    }

    return response.json();
}

export async function restartDeployment(name: string, action: string) {
  const response = await fetch(`http://127.0.0.1:8000/deployments/${name}/${action}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });

//   if (!response.ok) {
//     throw new Error("Failed to restart Deployment");
//   }
 if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to ${action} deployment: ${response.status} ${text}`);
  }

  return response.json();
}