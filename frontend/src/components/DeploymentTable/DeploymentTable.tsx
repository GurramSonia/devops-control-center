import type { deploymentData } from "../../types/deployment";
import StatusBadge from "../StatusBadge/StatusBadge";

type DeploymentsTableProps = {
  data: deploymentData[];
  onRestart: (name: string, action: string) => Promise<void>;
  restartingDeployment: string | null;
};

export default function DeploymentsTable( { data,onRestart,restartingDeployment }: DeploymentsTableProps ) {
    if (!data || data.length === 0) {
        return <div>No deployments available</div>;
    }

    return (
        <div className="deployment-table">
            <h3>deployments Table</h3>
            <table>
                <thead>
                    <tr>
                        <th>name</th>
                        <th>namespace</th>
                        <th>replicas</th>
                        <th>availableReplicas</th>
                        <th>status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((deployment) => (
                        <tr key={`${deployment.name}-${deployment.namespace}`}>
                            <td>{deployment.name}</td>
                            <td>{deployment.namespace}</td>
                            {/* <td>{deployment.status}</td> */}
                            <td>{deployment.replicas}</td>
                            <td>{deployment.availableReplicas}</td>
                            <StatusBadge
                                podName={deployment.name}
                                status={deployment.status}
                            />
                             <td>
                                <button onClick={() => onRestart(deployment.name,"scale-up")}>+</button>
                                <button onClick={() => onRestart(deployment.name,"scale-down")}>-</button>
                            <button
                          onClick={() => onRestart(deployment.name,"restart")}
                        disabled={restartingDeployment === deployment.name}
                       >
                        {restartingDeployment === deployment.name ? "Restarting..." : "Restart"}
              </button> 
            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}