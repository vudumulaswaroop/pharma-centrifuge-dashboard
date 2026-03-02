export function AlertItem({ alert, onAck }) {
    const icons = { critical: "🔴", warning: "🟡", info: "🔵" };
    return (
        <div className={`alert-item ${alert.type}`}>
            <div className="alert-ic">{icons[alert.type]}</div>
            <div style={{ flex: 1 }}>
                <div className="alert-msg">{alert.msg}</div>
                <div className="alert-meta">{alert.machine} · {alert.plant} · {alert.time}</div>
            </div>
            <button className={`btn-ack ${alert.ack ? "acked" : ""}`}
                    onClick={() => !alert.ack && onAck && onAck(alert.id)}>
                {alert.ack ? "✓ Done" : "Ack"}
            </button>
        </div>
    );
}
