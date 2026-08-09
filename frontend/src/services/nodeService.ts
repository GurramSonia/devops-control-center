import type { nodeData } from "../types/node";

export async function getNodeData(): Promise<nodeData[]> {
  const response = await fetch("http://127.0.0.1:8001/nodes");

  if (!response.ok) {
    throw new Error("Failed to fetch node data");
  }

  return response.json();
}