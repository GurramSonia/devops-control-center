import "./StatusBadge.css";


type StatusBadgeProps = {
    resourceName: string;
    status: string;
    
};

function StatusBadge(props:StatusBadgeProps) {
    const normalizedStatus = props.status.toLowerCase().replace(/\s+/g, "-");
    const className = `status-badge status-badge--${normalizedStatus}`;
    return(
        <div className={className}> 
            <p>{props.status}</p>
        </div>
    )
}
export default StatusBadge;