import { useState,useEffect, useCallback } from "react";
import type { podData } from "../types/pod";
import { getPodData } from "../services/podService";
function usePods() {
    const [podData, setPodData] = useState<podData[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);



    const fetchPodData = useCallback(async (useLoading = true) => {
            try {
                if (useLoading) setLoading(true);
                else setRefreshing(true);
                // setLoading(true);
                const data = await getPodData();
                setPodData(data);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to fetch pod data");
            } finally {
                // setLoading(false);
                if (useLoading) setLoading(false);
                else setRefreshing(false);
            }
            },[])
         useEffect(() => {
    fetchPodData(true);
  }, [fetchPodData]);

  const refreshPods = () => fetchPodData(false);
        

return { podData, loading, error,refreshing, refreshPods };
}

export default usePods;
