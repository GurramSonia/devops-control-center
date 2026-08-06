import "./StatusBadge.css";


type StatusBadgeProps = {
    status: string;
    podName: string;
};

function StatusBadge(props:StatusBadgeProps) {
    const normalizedStatus = props.status.toLowerCase().replace(/\s+/g, "-");
    const className = `status-badge status-badge--${normalizedStatus}`;
    return(
        <span className={className}> 
            <span>{props.status}</span>
        </span>
    )
}
export default StatusBadge;