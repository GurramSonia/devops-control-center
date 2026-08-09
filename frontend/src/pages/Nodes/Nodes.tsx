import { useMemo, useState, useEffect } from "react";
import useNodes from "../../hooks/useNodes";
import "../../components/Toast/Toast.css";
import Toast from "../../components/Toast/Toast";
import NodesTable from "../../components/NodesTable/NodesTable";

function Nodes() {
  const { nodeData, loading, error, refreshNodes } = useNodes();
  const [toast, setToast] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [autoRefresh, setAutoRefresh] = useState(true);

  const filteredNodes = useMemo(() => {
    if (!nodeData) return [];
    const lowerSearch = searchText.toLowerCase();
    return nodeData
      .filter((node) => {
        const matchesSearch = node.name.toLowerCase().includes(lowerSearch);
        const matchesStatus = selectedStatus === "all" || node.status === selectedStatus;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [nodeData, searchText, selectedStatus]);

  const handleRefresh = async () => {
    await refreshNodes();
    setToast("Refreshed nodes");
  };

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      refreshNodes();
    }, 10000);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshNodes]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(timer);
  }, [toast]);

    if (loading) return <h2>Loading Nodes...</h2>;
    if (error) return <h2>{error}</h2>;
    if (!nodeData) return <h2>No Node data</h2>;  

  const statuses = Array.from(new Set(nodeData.map((node) => node.status)));

  return (
    <>
      {toast && <Toast message={toast} />}
      <p>This is the Nodes page</p>

      <div className="nodes-controls">
        <button className="refresh-btn" onClick={handleRefresh}>
          🔄 Refresh
        </button>

        <label className="nodes-control-group">
          <input
            type="checkbox"
            checked={autoRefresh}
            onChange={(e) => setAutoRefresh(e.target.checked)}
          />
          Auto Refresh
        </label>

        <span>Every 10 seconds</span>
      </div>
      <div className="nodes-filter-bar">
  <input
    type="text"
    placeholder="Search nodes"
    value={searchText}
    onChange={(e) => setSearchText(e.target.value)}
  />
  <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
    <option value="all">All statuses</option>
    {statuses.map((status) => (
      <option key={status} value={status}>
        {status}
      </option>
    ))}
  </select>
</div>

      <NodesTable data={filteredNodes} />

    </>
  );
}

export default Nodes;