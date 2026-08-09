import { useState,useEffect,useCallback } from "react";
import type { DashboardData } from "../types/dashboard";
import { getDashboardData } from "../services/dashboardService";
function useDashboard() {
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
     const [refreshing, setRefreshing] = useState(false);


    const fetchDashboardData = useCallback(async (useLoading = true) => {
            try {
                const data = await getDashboardData();
                if (useLoading) setLoading(true);
                else setRefreshing(true);
                setDashboardData(data);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to fetch DashBoard data");
            } finally {
                 if (useLoading) setLoading(false);
                else setRefreshing(false);
            }
    },[]);
        
    useEffect(() => {
    fetchDashboardData();
    }, [fetchDashboardData]);
const refreshDashboard = () => fetchDashboardData(false);

return { dashboardData, loading, error,refreshDashboard,refreshing };
}
export default useDashboard;