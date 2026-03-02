import {NAV, ROLE_CONFIG} from "../constants";

export function Sidebar({ user, view, onNav, onLogout, alertCount, warningCount }) {
    const allowed = ROLE_CONFIG[user.role]?.views || [];
    return (
        <nav className="sidebar">
            <div className="sidebar-top">
                <div className="logo-row">
                    <div className="logo-hex">⚙</div>
                    <div>
                        <div className="logo-name">Pharma Dashboard</div>
                        <div className="logo-sub">Pharma Suite</div>
                    </div>
                </div>
            </div>

            <div className="sidebar-user">
                <div className="avatar">{user.avatar || user.name[0]}</div>
                <div>
                    <div className="user-info-name">{user.name}</div>
                    <div className={`user-info-role role-${user.role}`}>{ROLE_CONFIG[user.role]?.label || user.role}</div>
                </div>
            </div>

            <div className="sidebar-nav">
                <div className="nav-sect-title">Navigation</div>
                {NAV.filter(n => allowed.includes(n.id)).map(n => {
                    const badge = n.id === "maintenance" && alertCount > 0 ? alertCount :
                        n.id === "machines"    && warningCount > 0 ? warningCount : null;
                    return (
                        <div key={n.id} className={`nav-item ${view === n.id ? "active" : ""}`}
                             onClick={() => onNav(n.id)}>
                            <span className="nav-ic">{n.icon}</span>
                            <span>{n.label}</span>
                            {badge && <span className="nav-badge">{badge}</span>}
                        </div>
                    );
                })}
            </div>

            <div className="sidebar-bot">
                <div style={{ fontSize:9, color:"var(--text3)", fontFamily:"var(--mono)", marginBottom:8, letterSpacing:2 }}>
                    {user.plant} · {user.dept}
                </div>
                <button className="btn-logout" onClick={onLogout}>
                    <span>⬡</span> Sign Out
                </button>
            </div>
        </nav>
    );
}
