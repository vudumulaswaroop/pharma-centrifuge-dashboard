export function ProgressRow({ label, value, color, max = 100 }) {
    const pct   = Math.min((value / max) * 100, 100);
    const clr   = color || (pct > 90 ? "var(--green)" : pct > 70 ? "var(--yellow)" : "var(--red)");
    return (
        <div style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{label}</span>
                <span style={{ fontFamily: "var(--mono)", fontSize: 12, color: clr }}>{value}%</span>
            </div>
            <div className="prog-track">
                <div className="prog-fill" style={{ width: `${pct}%`, background: clr }}/>
            </div>
        </div>
    );
}
