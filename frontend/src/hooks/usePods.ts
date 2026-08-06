import { useState,useEffect } from "react";
import type { podData } from "../types/pod";
import { getPodData } from "../services/podService";
function usePods() {
    const [podData, setPodData] = useState<podData[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);



    const fetchPodData = async () => {
            try {
                setLoading(true);
                const data = await getPodData();
                setPodData(data);
            } catch (err) {
                setError("Failed to fetch pod data");
            } finally {
                setLoading(false);
            }
    };
        
    useEffect(() => {
    fetchPodData();
    }, []);

return { podData, loading, error, refreshPods: fetchPodData };
}
export default usePods;
