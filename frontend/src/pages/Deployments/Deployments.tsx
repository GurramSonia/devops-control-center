

import  { useMemo, useState,useEffect } from "react";
import useDeployments from "../../hooks/useDeployment";
import DeploymentsTable from "../../components/DeploymentTable/DeploymentTable";
import "../../components/Toast/Toast.css";
import Toast from "../../components/Toast/Toast";
import DeploymentsFilterBar from "../../components/DeploymentsFilterBar/DeploymentsFilterBar";
import { restartDeployment} from "../../services/deploymentService";
import { scaleDeployment } from "../../services/deploymentService";

function Deployments(){
    const {deploymentData,loading,error,refreshDeployments}= useDeployments
();
    const [searchText, setSearchText] = useState("");
    const [selectedNamespace, setSelectedNamespace] = useState("all");
    const[selectedStatus,setSelectedStatus]=useState("all");
    const[sortData,setSortData]=useState("a-z");
    const [toast, setToast] = useState<string | null>(null);
    const [autoRefresh, setAutoRefresh] = useState(true);
     const [restartingDeployment, setRestartingDeployment] = useState<string | null>(null);

    const handleRefresh = async () => {
    await refreshDeployments();
    setToast("Refreshed Deployments");
    };

    useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
        refreshDeployments();
    }, 10000);

    return () => clearInterval(interval);
}, [autoRefresh, refreshDeployments]);

    
    useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(timer);
}, [toast]);
   
    const unique_namespaces = useMemo(() => {
        if (!deploymentData) {
            return [];
        }
        const uniqueNamespaces = new Set(deploymentData.map((deployment) => deployment.namespace));
        return Array.from(uniqueNamespaces);
    }, [deploymentData]);

     const uniqueStatuses = useMemo(() => {
        if (!deploymentData) {
            return [];
        }
        const deployment_status = new Set(deploymentData.map((deployment) => deployment.status));
        return Array.from(deployment_status);
    }, [deploymentData]);

    const filteredDeployments= useMemo(() => {
        if (!deploymentData) {
            return [];
        }
        const lowerSearch = searchText.toLowerCase();
        const filtered= deploymentData.filter((deployment) => {
            const matchesSearch =
                deployment.name.toLowerCase().includes(lowerSearch)
            const matchesNamespace =
                selectedNamespace === "all" || deployment.namespace === selectedNamespace;

            const matchesStatus=
            selectedStatus==="all"|| deployment.status===selectedStatus;
            return matchesSearch && matchesNamespace && matchesStatus;
        });

        return filtered.sort((a, b) => {
        if (sortData === "z-a") {
            return b.name.localeCompare(a.name);
        }
        return a.name.localeCompare(b.name);
    });
    }, [deploymentData, searchText, selectedNamespace,selectedStatus,sortData]);


    const handleRestart = async (deploymentName: string) => {
        setRestartingDeployment(deploymentName);
        try {
          await restartDeployment(deploymentName);
          await refreshDeployments();
          setToast(`Restarted ${deploymentName} successfully`);
        } catch (err) {
          console.error(err);
          setToast("Restart failed");
        } finally {
          setRestartingDeployment(null);
        }
      };
    if (loading || deploymentData === null) {
        return <h2>Loading Deployments
        ...</h2>;
    }

    if (error) {
        return <h2>{error}</h2>;
    }
  const handleScale = async (deploymentName: string, newReplicas: number) => {
  try {
    await scaleDeployment(deploymentName, newReplicas);
    await refreshDeployments();
    setToast(`Scaled ${deploymentName} → ${newReplicas}`);
  } catch (err) {
    console.error(err);
    setToast("Scale failed");
  }
};


    const totalDeployments= deploymentData.length;
    const isFiltered =
    searchText !== "" ||
    selectedNamespace !== "all" ||
    selectedStatus !== "all";
    const deploymentCountLabel = isFiltered
    ? `Deployments
 (${filteredDeployments
    .length} of ${totalDeployments
    
    })`
    : `Deployments
 (${totalDeployments
    
    })`;

    return(
    <>
        {toast && (
    <Toast message={toast} />
)}
         <p>This is the Deployments
         page</p>
    <div className="Deployments-controls">
        <button className="refresh-btn" onClick={handleRefresh}>🔄 Refresh</button>

        <label className="Deployments-control-group">
            <input
            type="checkbox"
            checked={autoRefresh}
            onChange={(e) => setAutoRefresh(e.target.checked)}
        />
        Auto Refresh
        </label>

        <span>Every 10 seconds</span>
    </div>

    
    <DeploymentsFilterBar
    searchText={searchText}
    selectedNamespace={selectedNamespace}
    selectedStatus={selectedStatus}
    sortData={sortData}
    onSearchChange={setSearchText}
    onNamespaceChange={setSelectedNamespace}
    onStatusChange={setSelectedStatus}
    onSortChange={setSortData}
    uniqueNamespaces={unique_namespaces}
    uniqueStatuses={uniqueStatuses}
/>

    <div>
        <h3>{deploymentCountLabel}</h3>
            <DeploymentsTable data={filteredDeployments}  showActions={true} onRestart={handleRestart} onScale={handleScale} restartingDeployment={restartingDeployment} />
    </div>
    </>
    );
}
export default Deployments;