import StatusCard from "../../components/StatusCard/StatusCard";
import "./Dashboard.css";
import DeploymentTable from "../../components/DeploymentTable/DeploymentTable";
import useDashboard from "../../hooks/useDashboard";
import useDeployments from "../../hooks/useDeployment";

function Dashboard(){
    const {
    dashboardData,
    loading,
    error,
   } = useDashboard();
  const { deploymentData } = useDeployments();
  const noopAsync = async (_name?: string): Promise<void> => {};

    // if (dashboardData === null) {
    //     return <h2>Loading Dashboard...</h2>;
    //         };
    if (loading && !dashboardData) return <h2>Loading Dashboard Data...</h2>;
    if (error) return <h2>{error}</h2>;
    if (!dashboardData) return <h2>No Dashboard data</h2>;  
    const previewDeployments = deploymentData ? deploymentData.slice(0, 5) : [];
    return(
        <>
        <p>This is the Dashboard page</p>
        
        <div className="cards-container">
            
            
            <StatusCard title="No of Running Pods" value={dashboardData.runningPods} />
            <StatusCard title="CPU Usage (%)" value={`${dashboardData.cpuUsage}%`} />
            <StatusCard title="Memory Usage (%)" value={`${dashboardData.memoryUsage}%`} />
            <StatusCard title="Cluster Status" value={dashboardData.clusterStatus} />
            <StatusCard title="No of Failed Pods" value={dashboardData.failedPods} />
            <StatusCard title="No of Deployments" value={dashboardData.deployments} />  

        </div>
        <div>
          <DeploymentTable
          data={previewDeployments}
          showActions={false}
        />
        </div>
        </>
    );
}
export default Dashboard;