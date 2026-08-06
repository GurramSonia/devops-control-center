import { useState,useEffect } from "react";
import type { deploymentData } from "../types/deployment";
import { getDeploymentData } from "../services/deploymentService";
function useDeployments() {
    const [deploymentData, setDeploymentData] = useState<deploymentData[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);



    const fetchDeploymentData = async () => {
            try {
                setLoading(true);
                const data = await getDeploymentData();
                setDeploymentData(data);
            } catch (err) {
                setError("Failed to fetch deploymentdata");
            } finally {
                setLoading(false);
            }
    };
        
    useEffect(() => {
    fetchDeploymentData();
    }, []);

return { deploymentData, loading, error, refreshDeployments: fetchDeploymentData };
}
export default useDeployments;