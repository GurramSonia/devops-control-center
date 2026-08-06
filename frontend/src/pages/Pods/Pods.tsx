import  { useMemo, useState } from "react";
import usePods from "../../hooks/usePods";

import { restartPod } from "../../services/podService";
import PodsTable from "../../components/PodsTable/PodsTable";

function Pods(){
    const [restartingPod, setRestartingPod] = useState<string | null>(null);
    const {podData,loading,error,refreshPods}= usePods();
    const [searchText, setSearchText] = useState("");
   

    const filteredPods = useMemo(() => {
        if (!podData) {
            return [];
        }
        const lowerSearch = searchText.toLowerCase();
        return podData.filter((pod) =>
            pod.name.toLowerCase().includes(lowerSearch) ||
            pod.namespace.toLowerCase().includes(lowerSearch) ||
            pod.status.toLowerCase().includes(lowerSearch) ||
            pod.restarts.toString().includes(lowerSearch)
        );
    }, [podData, searchText]);


    const handleRestart = async (podName: string) => {
    setRestartingPod(podName);
    try {
      await restartPod(podName);
      await refreshPods();
       alert(`Restarted ${podName} successfully`);
    } catch (err) {
      console.error(err);
      alert("Restart failed");
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

    return(
        <>
            <p>This is the Pods page</p>
            <div>
                <label htmlFor="pod-search">Search pods:</label>
                <input
                    id="pod-search"
                    type="text"
                    value={searchText}
                    onChange={(event) => setSearchText(event.target.value)}
                    placeholder="Filter by name, namespace, status, or restarts"
                />
            </div>
            <div>
                <PodsTable data={filteredPods} onRestart={handleRestart} restartingPod={restartingPod} />
            </div>
        </>
    );
}
export default Pods;