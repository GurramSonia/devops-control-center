import type { nodeData } from "../types/node";
import { apiFetch } from "./apiFetch";

export async function getNodeData(): Promise<nodeData[]> {
   const response = await apiFetch("/nodes");

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