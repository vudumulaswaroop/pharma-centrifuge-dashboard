import {useState} from "react";
import {StatCard} from "../ui/StatCard";
import {Panel} from "../ui/Panel";
import {AlertItem} from "../ui/AlertItem";

export function Maintenance({ metrics, alerts, onAck, user }) {
    const [filter, setFilter]   = useState("all");
    const [tab,    setTab]      = useState("alerts");

    const overdue = metrics.filter(m => m.nextMaintDays <= 0);
    const urgent  = metrics.filter(m => m.nextMaintDays > 0 && m.nextMaintDays <= 7);
    const unack   = alerts.filter(a => !a.ack).length;

    const filteredAlerts = filter === "all" ? alerts :
        filter === "critical" ? alerts.filter(a => a.type === "critical") :
            filter === "unack" ? alerts.filter(a => !a.ack) : alerts;

    return (
        <>
            <div className="breadcrumb">
                <span>CentroMon</span><span className="bc-sep">/</span><span>Maintenance Center</span>
            </div>

            <div className="stats-row">
                <StatCard label="Overdue"      value={overdue.length}   sub="machines"                   icon="🔴" color="var(--red)"/>
                <StatCard label="Due This Week" value={urgent.length}   sub="within 7 days"              icon="🟡" color="var(--yellow)"/>
                <StatCard label="Scheduled"    value="8"                sub="this month"                 icon="📅" color="var(--green)"/>
                <StatCard label="MTBF"         value="1842h"            sub="mean time between failures" icon="📈" color="var(--acc)"/>
                <StatCard label="MTTR"         value="4.2h"             sub="mean time to repair"        icon="🔧" color="var(--orange)"/>
            </div>

            {/* Tabs */}
            <div className="tabs">
                {[["alerts","🚨 Alerts"],["schedule","📅 Schedule"],["history","📋 History"]].map(([id, lbl]) => (
                    <button key={id} className={`tab ${tab === id ? "active" : ""}`} onClick={() => setTab(id)}>{lbl}</button>
                ))}
            </div>

            {tab === "alerts" && (
                <div className="g65 mb">
                    <Panel title="Maintenance Alerts" icon="🚨 "
                           meta={`${unack} unacknowledged`}
                           action={
                               <div style={{ display: "flex", gap: 4 }}>
                                   {["all","critical","unack"].map(f => (
                                       <button key={f} className={`btn-sm ${filter === f ? "active" : ""}`}
                                               style={filter === f ? { borderColor: "var(--acc)", color: "var(--acc)" } : {}}
                                               onClick={() => setFilter(f)}>
                                           {f.toUpperCase()}
                                       </button>
                                   ))}
                               </div>
                           }
                    >
                        <div className="alert-list">
                            {filteredAlerts.map(a => (
                                <AlertItem key={a.id} alert={a} onAck={onAck}/>
                            ))}
                        </div>
                    </Panel>

                    <Panel title="Alert Summary" icon="📊 ">
                        {[
                            { label: "Critical", count: alerts.filter(a=>a.type==="critical").length, color: "var(--red)" },
                            { label: "Warning",  count: alerts.filter(a=>a.type==="warning").length,  color: "var(--yellow)" },
                            { label: "Info",     count: alerts.filter(a=>a.type==="info").length,      color: "var(--acc)" },
                            { label: "Ack'd",    count: alerts.filter(a=>a.ack).length,               color: "var(--green)" },
                        ].map(item => (
                            <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgba(28,47,82,0.4)" }}>
                                <span style={{ fontSize: 13, fontWeight: 600 }}>{item.label}</span>
                                <span style={{ fontFamily: "var(--mono)", fontSize: 18, fontWeight: 700, color: item.color }}>{item.count}</span>
                            </div>
                        ))}

                        <div style={{ marginTop: 20 }}>
                            <div style={{ fontSize: 11, color: "var(--text2)", fontFamily: "var(--mono)", marginBottom: 10 }}>ALERTS BY PLANT</div>
                            {["Plant A","Plant B","Plant C"].map(p => {
                                const n = alerts.filter(a => a.plant === p).length;
                                return (
                                    <div key={p} style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                                        <span style={{ fontSize:12, color:"var(--text2)" }}>{p}</span>
                                        <span style={{ fontFamily:"var(--mono)", fontSize:12, color:"var(--acc)" }}>{n} alert{n!==1?"s":""}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </Panel>
                </div>
            )}

            {tab === "schedule" && (
                <Panel title="Maintenance Schedule" icon="📅 ">
                    <table className="tbl">
                        <thead>
                        <tr>
                            <th>Machine</th><th>Name</th><th>Plant</th><th>Last Service</th>
                            <th>Next Due</th><th>Run Hours</th><th>Priority</th><th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {metrics
                            .slice()
                            .sort((a,b) => a.nextMaintDays - b.nextMaintDays)
                            .map(m => {
                                const days = m.nextMaintDays;
                                const color = days < 0 ? "var(--red)" : days < 7 ? "var(--yellow)" : "var(--green)";
                                const priority = days < 0 ? "OVERDUE" : days < 7 ? "URGENT" : days < 30 ? "SOON" : "OK";
                                return (
                                    <tr key={m.id}>
                                        <td style={{ fontFamily:"var(--mono)", color:"var(--acc)", fontSize:12 }}>{m.id}</td>
                                        <td style={{ fontWeight:600, fontSize:13 }}>{m.name}</td>
                                        <td style={{ fontSize:11, color:"var(--text2)" }}>{m.plant}</td>
                                        <td style={{ fontSize:11, color:"var(--text2)", fontFamily:"var(--mono)" }}>{m.lastMaintenance}</td>
                                        <td style={{ color, fontFamily:"var(--mono)", fontSize:12 }}>
                                            {days < 0 ? `${Math.abs(days)}d overdue` : `In ${days}d`}
                                        </td>
                                        <td style={{ fontFamily:"var(--mono)", fontSize:12, color:"var(--text2)" }}>{m.runHours}h</td>
                                        <td><span style={{ padding:"2px 8px", borderRadius:4, fontSize:9, fontWeight:700, background:`rgba(${days<0?"255,45,85":days<7?"255,225,53":"0,240,160"},0.12)`, color, fontFamily:"var(--mono)", letterSpacing:1 }}>{priority}</span></td>
                                        <td>
                                            {user.role !== "plant" && (
                                                <button className="btn-sm" style={{ fontSize:10 }}>Schedule</button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </Panel>
            )}

            {tab === "history" && (
                <Panel title="Maintenance History" icon="📋 ">
                    <table className="tbl">
                        <thead><tr><th>Date</th><th>Machine</th><th>Type</th><th>Technician</th><th>Duration</th><th>Notes</th><th>Status</th></tr></thead>
                        <tbody>
                        {[
                            { date:"2025-12-15", machine:"CF-001", type:"Full Service",   tech:"J. Patel",    dur:"6h", notes:"Bearing replaced, seal inspected",     ok:true },
                            { date:"2025-12-10", machine:"CF-003", type:"Emergency",      tech:"R. Kumar",    dur:"3h", notes:"Door sensor replaced after fault",      ok:true },
                            { date:"2025-11-28", machine:"CF-002", type:"Lubrication",    tech:"A. Singh",    dur:"1h", notes:"Rotor lubricated, balance checked",     ok:true },
                            { date:"2025-11-20", machine:"CF-005", type:"Inspection",     tech:"V. Nair",     dur:"2h", notes:"No defects found, seals at 80% life",   ok:true },
                            { date:"2025-11-05", machine:"CF-004", type:"Calibration",    tech:"J. Patel",    dur:"4h", notes:"RPM sensor recalibrated, motor checked", ok:true },
                            { date:"2025-10-22", machine:"CF-006", type:"Bearing Replace",tech:"R. Kumar",    dur:"5h", notes:"Left bearing replaced, vibration fixed", ok:true },
                        ].map((row, i) => (
                            <tr key={i}>
                                <td style={{ fontFamily:"var(--mono)", fontSize:11, color:"var(--text2)" }}>{row.date}</td>
                                <td style={{ fontFamily:"var(--mono)", color:"var(--acc)", fontSize:12 }}>{row.machine}</td>
                                <td style={{ fontSize:12, fontWeight:600 }}>{row.type}</td>
                                <td style={{ fontSize:12, color:"var(--text2)" }}>{row.tech}</td>
                                <td style={{ fontFamily:"var(--mono)", fontSize:12, color:"var(--text2)" }}>{row.dur}</td>
                                <td style={{ fontSize:11, color:"var(--text2)", maxWidth:200 }}>{row.notes}</td>
                                <td><span style={{ background:"rgba(0,240,160,0.12)", color:"var(--green)", padding:"2px 7px", borderRadius:4, fontSize:9, fontFamily:"var(--mono)", fontWeight:700, letterSpacing:1 }}>COMPLETED</span></td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </Panel>
            )}
        </>
    );
}
