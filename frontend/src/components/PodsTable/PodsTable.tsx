import type { podData } from "../../types/pod";
import StatusBadge from "../StatusBadge/StatusBadge";

type PodsTableProps = {
  data: podData[];
  onRestart: (name: string) => Promise<void>;
  restartingPod: string | null;
};

export default function PodsTable( { data, onRestart, restartingPod }: PodsTableProps ) {
    if (!data || data.length === 0) {
        return <div>No pods available</div>;
    }

    return (
        <div className="deployment-table">
            <h3>Pods Table</h3>
            <table>
                <thead>
                    <tr>
                        <th>name</th>
                        <th>namespace</th>
                        <th>status</th>
                        <th>restarts</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((pod) => (
                        <tr key={`${pod.name}-${pod.namespace}`}>
                            <td>{pod.name}</td>
                            <td>{pod.namespace}</td>
                            {/* <td>{pod.status}</td> */}
                            <td>
                            <StatusBadge
                                podName={pod.name}
                                status={pod.status}
                                restartingPod={restartingPod}
                            />
                            </td>
                            <td>{pod.restarts}</td>
                            <td>
                        <button
                         onClick={() => onRestart(pod.name)}
                        disabled={restartingPod === pod.name}
                        >
                        {restartingPod === pod.name ? "Restarting..." : "Restart"}
              </button>
            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}