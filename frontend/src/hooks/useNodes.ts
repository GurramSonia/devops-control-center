import { useState, useEffect } from "react";
import type { nodeData } from "../types/node";
import { getNodeData } from "../services/nodeService";

function useNodes() {
  const [nodeData, setNodeData] = useState<nodeData[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNodeData = async () => {
    try {
      setLoading(true);
      const data = await getNodeData();
      setNodeData(data);
    } catch (err) {
      setError("Failed to fetch node data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNodeData();
  }, []);

  return { nodeData, loading, error, refreshNodes: fetchNodeData };
}

export default useNodes;