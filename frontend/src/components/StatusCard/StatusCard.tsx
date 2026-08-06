import "./StatusCard.css";
function StatusCard(props: { title: string; value: number|string; }) {
    return(
        <div className="status-card">
            <h3>{props.title}</h3>
            <p>{props.value}</p>
        </div>
    );
}
export default StatusCard;