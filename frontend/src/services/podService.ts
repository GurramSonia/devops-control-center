import type { podData } from "../types/pod";
import { apiFetch } from "./apiFetch";


export async function getPodData(): Promise<podData[]> {
   const token = localStorage.getItem("token");
    const response = await fetch("http://127.0.0.1:8000/pods", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

   if (!response.ok) {
    const body = await response.json().catch(() => null);
    const message =
      body?.detail ||
      (await response.text()) ||
      "Failed to fetch pod data";
    throw new Error(message);
  }


    return response.json();
}


export async function restartPod(podName: string, namespace: string) {
  const response = await apiFetch(
    `/pods/${podName}/restart?namespace=${encodeURIComponent(namespace)}`,
    {
      method: "POST",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to restart pod");
  }

  return response.json();
}


export async function getPodLogs(
  podName: string,
  namespace: string
): Promise<string> {
    const response = await apiFetch(
    `/pods/${podName}/logs?namespace=${encodeURIComponent(namespace)}`
  );
  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || "Failed to fetch pod logs");
  }

  return response.text();
}

