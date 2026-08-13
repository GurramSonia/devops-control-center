import type { deploymentData } from "../../types/deployment";
import StatusBadge from "../StatusBadge/StatusBadge";

type DeploymentsTableProps = {
  data: deploymentData[];
  showActions?: boolean;
  onRestart?: (name: string) => Promise<void>;
  onScale?:(name: string,newReplicas: number)=>Promise<void>;
  restartingDeployment?: string | null;
};

export default function DeploymentsTable( { data,showActions = false,onRestart,onScale,restartingDeployment=null }: DeploymentsTableProps ) {
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
                        {showActions && <th>Actions</th>}
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
                            <td>
                            <StatusBadge
                                resourceName={deployment.name}
                                status={deployment.status}
                            />
                            </td>
                             
                        {showActions && (
                            <td>
                                <button onClick={() => onScale?.(deployment.name, deployment.replicas + 1)}>+</button>
                                
                                <button
                                onClick={() => onScale?.(deployment.name, Math.max(0, deployment.replicas - 1))}
                                disabled={deployment.replicas <= 0}
                                title={deployment.replicas <= 0 ? "Cannot go below 0 replicas" : "Scale down"}
                                aria-disabled={deployment.replicas <= 0}>
                                 -
                                </button>
                            <button
                          onClick={() => onRestart?.(deployment.name)}
                        disabled={restartingDeployment === deployment.name}
                       >
                        {restartingDeployment === deployment.name ? "Restarting..." : "Restart"}
              </button> 
            </td>
                )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}