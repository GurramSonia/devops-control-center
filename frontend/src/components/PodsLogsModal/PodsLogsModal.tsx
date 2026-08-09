// frontend/src/components/PodLogsModal/PodLogsModal.tsx
import "./PodLogsModal.css";
import type { podData } from "../../types/pod";

type PodLogsModalProps = {
  pod: podData;
  logs: string | null;
  loading: boolean;
  error: string | null;
  onClose: () => void;
};

export default function PodLogsModal({
  pod,
  logs,
  loading,
  error,
  onClose,
}: PodLogsModalProps) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-panel" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>Pod Logs</h2>
            <p>
              {pod.name} · {pod.namespace}
            </p>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          {loading && <div className="modal-status">Loading logs...</div>}

          {error && <div className="modal-error">{error}</div>}

          {!loading && !error && (
            <pre className="modal-logs">
              {logs || "No logs available for this pod."}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}