export function Topbar({ title, time, alertCount, onNotif }) {
    const VIEW_TITLES = {
        overview:    "Fleet Overview",
        machines:    "Centrifuge Machines",
        maintenance: "Maintenance Center",
        analytics:   "Production Analytics",
        reports:     "Executive Reports",
        admin:       "System Administration",
    };
    return (
        <div className="topbar">
            <div className="topbar-title">{VIEW_TITLES[title] || title}</div>
            <span className="topbar-pill">
        <span className="live-dot"/>
        LIVE MONITORING
      </span>
            <div className="topbar-notif" onClick={onNotif}>
                🔔
                {alertCount > 0 && <span className="notif-count">{alertCount}</span>}
            </div>
            <div className="topbar-clock">{time}</div>
        </div>
    );
}
