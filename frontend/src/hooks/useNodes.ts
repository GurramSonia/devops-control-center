import { useState, useEffect,useCallback } from "react";
import type { nodeData } from "../types/node";
import { getNodeData } from "../services/nodeService";

function useNodes() {
  const [nodeData, setNodeData] = useState<nodeData[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNodeData = useCallback(async (useLoading = true) => {
    try {
       if (useLoading) setLoading(true);
       else setRefreshing(true);
      const data = await getNodeData();
      setNodeData(data);
      setError(null);
    } catch (err) {
      //setError("Failed to fetch node data");
      setError(err instanceof Error ? err.message : "Failed to fetch node data");
    } finally {
      if (useLoading) setLoading(false);
      else setRefreshing(false);
    }
  },[])

  useEffect(() => {
    fetchNodeData(true);
  }, [fetchNodeData]);
   const refreshNodes = () => fetchNodeData(false);

  return { nodeData, loading, error,refreshing, refreshNodes };
}

export default useNodes;