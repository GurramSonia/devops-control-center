export default function DeploymentTable() {
    const deployments = [
        {
            name: "frontend",
            replicas: 3,
            status: "Running",
        },
        {
            name: "backend",
            replicas: 2,
            status: "Running",
        },
        {
            name: "redis",
            replicas: 1,
            status: "Running",
        },
    ];

    return (
        <div className="deployment-table">
            <h3>Deployment Table</h3>
            <table>
                <thead>
                    <tr>
                        <th>name</th>
                        <th>replicas</th>
                        <th>status</th>
                    </tr>
                </thead>
                <tbody>
                    {deployments.map((deployment) => (
                        <tr key={deployment.name}>
                            <td>{deployment.name}</td>
                            <td>{deployment.replicas}</td>
                            <td>{deployment.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}