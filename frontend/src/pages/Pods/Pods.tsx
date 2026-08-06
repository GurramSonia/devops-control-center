import  { useMemo, useState,useEffect } from "react";
import usePods from "../../hooks/usePods";

import { restartPod } from "../../services/podService";
import PodsTable from "../../components/PodsTable/PodsTable";
import "../../components/Toast/Toast.css";
import Toast from "../../components/Toast/Toast";
import PodsFilterBar from "../../components/PodsFilterBar/PodsFilterBar";

function Pods(){
    const [restartingPod, setRestartingPod] = useState<string | null>(null);
    const {podData,loading,error,refreshPods}= usePods();
    const [searchText, setSearchText] = useState("");
    const [selectedNamespace, setSelectedNamespace] = useState("all");
    const[selectedStatus,setSelectedStatus]=useState("all");
    const[sortData,setSortData]=useState("a-z");
    const [toast, setToast] = useState<string | null>(null);
    const [autoRefresh, setAutoRefresh] = useState(true);

    const handleRefresh = async () => {
    await refreshPods();
    setToast("Refreshed pods");
    };

    useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
        refreshPods();
    }, 10000);

    return () => clearInterval(interval);
}, [autoRefresh, refreshPods]);

    
    useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(timer);
}, [toast]);
   
    const unique_namespaces = useMemo(() => {
        if (!podData) {
            return [];
        }
        const uniqueNamespaces = new Set(podData.map((pod) => pod.namespace));
        return Array.from(uniqueNamespaces);
    }, [podData]);

     const uniqueStatuses = useMemo(() => {
        if (!podData) {
            return [];
        }
        const pod_status = new Set(podData.map((pod) => pod.status));
        return Array.from(pod_status);
    }, [podData]);

    const filteredPods = useMemo(() => {
        if (!podData) {
            return [];
        }
        const lowerSearch = searchText.toLowerCase();
        const filtered= podData.filter((pod) => {
            const matchesSearch =
                pod.name.toLowerCase().includes(lowerSearch)
            const matchesNamespace =
                selectedNamespace === "all" || pod.namespace === selectedNamespace;

            const matchesStatus=
            selectedStatus==="all"|| pod.status===selectedStatus;
            return matchesSearch && matchesNamespace && matchesStatus;
        });

        return filtered.sort((a, b) => {
        if (sortData === "z-a") {
            return b.name.localeCompare(a.name);
        }
        return a.name.localeCompare(b.name);
    });
    }, [podData, searchText, selectedNamespace,selectedStatus,sortData]);


    const handleRestart = async (podName: string) => {
    setRestartingPod(podName);
    try {
      await restartPod(podName);
      await refreshPods();
      setToast(`Restarted ${podName} successfully`);
    } catch (err) {
      console.error(err);
      setToast("Restart failed");
    } finally {
      setRestartingPod(null);
    }
  };

    if (loading || podData === null) {
        return <h2>Loading Pods...</h2>;
    }

    if (error) {
        return <h2>{error}</h2>;
    }


    const totalPods = podData.length;
    const isFiltered =
    searchText !== "" ||
    selectedNamespace !== "all" ||
    selectedStatus !== "all";
    const podCountLabel = isFiltered
    ? `Pods (${filteredPods.length} of ${totalPods})`
    : `Pods (${totalPods})`;

    return(
    <>
        {toast && (
    <Toast message={toast} />
)}
         <p>This is the Pods page</p>
    <div className="pods-controls">
        <button className="refresh-btn" onClick={handleRefresh}>🔄 Refresh</button>

        <label className="pods-control-group">
            <input
            type="checkbox"
            checked={autoRefresh}
            onChange={(e) => setAutoRefresh(e.target.checked)}
        />
        Auto Refresh
        </label>

        <span>Every 10 seconds</span>
    </div>

    
    <PodsFilterBar
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
        <h3>{podCountLabel}</h3>
            <PodsTable data={filteredPods} onRestart={handleRestart} restartingPod={restartingPod} />
    </div>
    </>
    );
}
export default Pods;