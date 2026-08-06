import { useState,useEffect } from "react";
import type { DashboardData } from "../types/dashboard";
import { getDashboardData } from "../services/dashboardService";
function useDashboard() {
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);


    const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const data = await getDashboardData();
                setDashboardData(data);
            } catch (err) {
                setError("Failed to fetch dashboard data");
            } finally {
                setLoading(false);
            }
    };
        
    useEffect(() => {
    fetchDashboardData();
    }, []);

return { dashboardData, loading, error };
}
export default useDashboard;