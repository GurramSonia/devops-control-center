import type { podData } from "../types/pod";


export async function getPodData(): Promise<podData[]> {
    const response = await fetch("http://127.0.0.1:8001/pods");

    if (!response.ok) {
        throw new Error("Failed to fetch poddata");
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