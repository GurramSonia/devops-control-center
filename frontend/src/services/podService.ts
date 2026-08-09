import type { podData } from "../types/pod";


export async function getPodData(): Promise<podData[]> {
    const response = await fetch("http://127.0.0.1:8001/pods");

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


export async function restartPod(name: string) {
  const response = await fetch(`http://127.0.0.1:8001/pods/${name}/restart`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    throw new Error("Failed to restart pod");
  }

  return response.json();
}


export async function getPodLogs(
  podName: string,
  namespace: string
): Promise<string> {
  const response = await fetch(
    `http://127.0.0.1:8001/pods/${encodeURIComponent(
      podName
    )}/logs?namespace=${encodeURIComponent(namespace)}`
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || "Failed to fetch pod logs");
  }

  return response.text();
}