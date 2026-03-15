export function AlertFeed({ alerts }) {
    return (
        <div className="alert-feed">
            {alerts.map((a, i) => (
                <div className={`alert-entry ${a.type}`} key={i}>
                    <span className="alert-icon">{a.icon}</span>
                    <div className="alert-body">
                        <div className={`alert-msg ${a.type}`}>{a.msg}</div>
                        <div className="alert-time">{a.time}</div>
                    </div>
                </div>
            ))}
        </div>
    );
}
