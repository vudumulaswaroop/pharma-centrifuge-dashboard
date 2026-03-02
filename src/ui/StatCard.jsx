export function StatCard({ label, value, sub, icon, color }) {
    return (
        <div className="stat-card" style={{ "--c": color }}>
            <div className="stat-icon">{icon}</div>
            <div className="stat-lbl">{label}</div>
            <div className="stat-val">{value}</div>
            {sub && <div className="stat-sub">{sub}</div>}
        </div>
    );
}
