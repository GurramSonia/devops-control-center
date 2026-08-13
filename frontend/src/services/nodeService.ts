import type { nodeData } from "../types/node";

export async function getNodeData(): Promise<nodeData[]> {
  const token = localStorage.getItem("token");
  const response = await fetch("http://127.0.0.1:8001/nodes", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const message =
      body?.detail ||
      (await response.text()) ||
      "Failed to fetch node data";
    throw new Error(message);
  }

  return response.json();
}