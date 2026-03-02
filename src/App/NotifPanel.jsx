export function NotifPanel({ alerts, onAck, onClose }) {
    const unack = alerts.filter(a => !a.ack);
    return (
        <div style={{
            position:"fixed", top:64, right:16, width:360, background:"var(--surf)",
            border:"1px solid var(--border2)", borderRadius:14, boxShadow:"0 16px 48px rgba(0,0,0,0.5)",
            z:1000, animation:"fadeIn .2s ease", overflow:"hidden",
        }}>
            <div style={{ padding:"14px 18px", borderBottom:"1px solid var(--border)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ fontWeight:700, fontSize:14 }}>🔔 Notifications</span>
                <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                    {unack.length > 0 && <span style={{ fontSize:10, color:"var(--red)", fontFamily:"var(--mono)" }}>{unack.length} unread</span>}
                    <button className="btn-sm" style={{ fontSize:10 }} onClick={onClose}>✕ Close</button>
                </div>
            </div>
            <div style={{ maxHeight:400, overflowY:"auto", padding:10 }}>
                {alerts.slice(0, 6).map(a => {
                    const icons = { critical:"🔴", warning:"🟡", info:"🔵" };
                    return (
                        <div key={a.id} className={`alert-item ${a.type}`} style={{ marginBottom:6 }}>
                            <div className="alert-ic">{icons[a.type]}</div>
                            <div style={{ flex:1 }}>
                                <div className="alert-msg" style={{ fontSize:12 }}>{a.msg}</div>
                                <div className="alert-meta">{a.machine} · {a.time}</div>
                            </div>
                            <button className={`btn-ack ${a.ack?"acked":""}`} onClick={() => !a.ack && onAck(a.id)}>
                                {a.ack ? "✓" : "Ack"}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
