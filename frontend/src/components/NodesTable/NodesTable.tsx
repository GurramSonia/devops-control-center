import type { nodeData } from "../../types/node";
import StatusBadge from "../StatusBadge/StatusBadge";

type NodesTableProps = {
  data: nodeData[];
};

export default function NodesTable({ data }: NodesTableProps) {
  if (!data || data.length === 0) {
    return <div>No nodes available</div>;
  }

  return (
    <div className="nodes-table-container"> 
      <h3>Nodes Table</h3>
      <table>
        <thead>
          <tr>
            <th>Node</th>
            <th>Status</th>
            <th>CPU</th>
            <th>Memory</th>
            <th>OS</th>
            <th>Arch</th>
            <th>Kubernetes Version</th>
          </tr>
        </thead>
        <tbody>
          {data.map((node) => (
            <tr key={node.name}>
              <td>{node.name}</td>
              <td>
                <StatusBadge resourceName={node.name} status={node.status} />
              </td>
              <td>{node.cpu}</td>
              <td>{node.memory}</td>
              <td>{node.osImage}</td>
              <td>{node.arch}</td>
              <td>{node.version}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}