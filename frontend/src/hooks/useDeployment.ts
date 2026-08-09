import { useState,useEffect,useCallback } from "react";
import type { deploymentData } from "../types/deployment";
import { getDeploymentData } from "../services/deploymentService";
function useDeployments() {
    const [deploymentData, setDeploymentData] = useState<deploymentData[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);



    const fetchDeploymentData = useCallback(async (useLoading = true) => {
            try {
                if (useLoading) setLoading(true);
                else setRefreshing(true);
                const data = await getDeploymentData();
                setDeploymentData(data);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to fetch deployment data");
            } finally {
                if (useLoading) setLoading(false);
                else setRefreshing(false);
            }
    },[])
        
    useEffect(() => {
    fetchDeploymentData();
    }, [fetchDeploymentData]);
 const refreshDeployments = () => fetchDeploymentData(false);

return { deploymentData, loading, error, refreshDeployments,refreshing};
}
export default useDeployments;