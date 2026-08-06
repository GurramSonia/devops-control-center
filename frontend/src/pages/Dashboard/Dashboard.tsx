import StatusCard from "../../components/StatusCard/StatusCard";
import "./Dashboard.css";
import DeploymentTable from "../../components/DeploymentTable/DeploymentTable";
import useDashboard from "../../hooks/useDashboard";


function Dashboard(){
    const {
    dashboardData,
    loading,
    error,
   } = useDashboard();

    if (dashboardData === null) {
        return <h2>Loading Dashboard...</h2>;
            };
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
            <DeploymentTable />
        </div>
        </>
    );
}
export default Dashboard;