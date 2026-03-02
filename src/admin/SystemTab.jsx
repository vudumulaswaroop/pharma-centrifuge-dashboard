import {SYSTEM_HEALTH} from "../constants";
import {Panel} from "../ui/Panel";

export function SystemTab() {
    return (
        <>
            <div className="g2 mb" style={{ gridTemplateColumns:"repeat(3,1fr)" }}>
                {Object.values(SYSTEM_HEALTH).map((s, i) => (
                    <div key={i} className="sys-card">
                        <div className="sys-top">
                            <span className="sys-name">{s.label}</span>
                            <span className="sys-val" style={{ color: s.status === "healthy" ? "var(--green)" : "var(--yellow)" }}>{s.value}</span>
                        </div>
                        <div className="sys-sub">{s.sub}</div>
                        <div style={{ marginTop:10 }}>
                            <div className="prog-track">
                                <div className="prog-fill" style={{ width: s.status === "healthy" ? "96%" : "72%", background: s.status === "healthy" ? "var(--green)" : "var(--yellow)" }}/>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="g2 mb">
                <Panel title="JWT Configuration" icon="🔐 ">
                    {[
                        { k:"Algorithm",        v:"HS256" },
                        { k:"Token Expiry",     v:"1 hour" },
                        { k:"Refresh Tokens",   v:"Enabled (7 days)" },
                        { k:"Issuer",           v:"centromon.pharma.com" },
                        { k:"Audience",         v:"centrifuge-monitoring" },
                        { k:"RBAC",             v:"Enabled (4 roles)" },
                    ].map(row => (
                        <div key={row.k} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:"1px solid rgba(28,47,82,0.35)", fontSize:12 }}>
                            <span style={{ color:"var(--text2)", fontFamily:"var(--mono)" }}>{row.k}</span>
                            <span style={{ fontFamily:"var(--mono)", color:"var(--acc)" }}>{row.v}</span>
                        </div>
                    ))}
                </Panel>

                <Panel title="Database Schema" icon="🗄 ">
                    {[
                        { table:"users",       rows:"4",    desc:"Authentication & role data" },
                        { table:"machines",    rows:"6",    desc:"Machine registry & config" },
                        { table:"metrics",     rows:"8.4M", desc:"Time-series sensor readings" },
                        { table:"alerts",      rows:"342",  desc:"Maintenance alert log" },
                        { table:"batches",     rows:"1,842",desc:"Production batch records" },
                        { table:"audit_logs",  rows:"24.1k",desc:"System audit trail" },
                    ].map(row => (
                        <div key={row.table} style={{ display:"flex", gap:12, padding:"8px 0", borderBottom:"1px solid rgba(28,47,82,0.35)", fontSize:12, alignItems:"center" }}>
                            <span style={{ fontFamily:"var(--mono)", color:"var(--yellow)", width:100, flexShrink:0 }}>{row.table}</span>
                            <span style={{ fontFamily:"var(--mono)", color:"var(--acc)", width:50, flexShrink:0 }}>{row.rows}</span>
                            <span style={{ color:"var(--text2)" }}>{row.desc}</span>
                        </div>
                    ))}
                </Panel>
            </div>
        </>
    );
}
