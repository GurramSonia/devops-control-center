import "./StatusBadge.css";


type StatusBadgeProps = {
    status: string;
    podName: string;
    restartingPod: string | null;
};

function StatusBadge(props:StatusBadgeProps) {
    const normalizedStatus = props.status.toLowerCase().replace(/\s+/g, "-");
    const className = `status-badge status-badge--${normalizedStatus}`;
//   const displayStatus =
//     props.restartingPod === props.podName ? "Restarting..." : props.status;

//return <span className={className}>{displayStatus}</span>;
    return(
        <span className={className}> 
            <span>{props.status}</span>
        </span>
    )
}
export default StatusBadge;