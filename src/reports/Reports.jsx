import {useState} from "react";
import {KPIS, REPORT_DATA} from "../constants";
import {Panel} from "../ui/Panel";
import {ProgressRow} from "../ui/ProgressRow";
import {StatCard} from "../ui/StatCard";

export function Reports() {
    const [tab, setTab] = useState("kpi");

    return (
        <>
            <div className="breadcrumb">
                <span>CentroMon</span><span className="bc-sep">/</span><span>Executive Reports</span>
            </div>

            <div className="stats-row" style={{ gridTemplateColumns:"repeat(4,1fr)" }}>
                <StatCard label="Reports Generated"  value="48"    sub="last 90 days"         icon="📄" color="var(--acc)"/>
                <StatCard label="Avg Fleet OEE"      value="88.4%" sub="this month"           icon="📊" color="var(--green)"/>
                <StatCard label="Energy Saved"       value="12.3%" sub="vs last quarter"      icon="⚡" color="var(--yellow)"/>
                <StatCard label="Predictive Alerts"  value="23"    sub="prevented downtime"   icon="🔮" color="var(--purple)"/>
            </div>

            <div className="tabs">
                {[["kpi","📊 KPI Summary"],["reports","📄 Report Library"],["compare","🔄 Plant Comparison"]].map(([id, lbl]) => (
                    <button key={id} className={`tab ${tab===id?"active":""}`} onClick={() => setTab(id)}>{lbl}</button>
                ))}
            </div>

            {tab === "kpi" && (
                <>
                    <div className="g2 mb">
                        {KPIS.map(k => (
                            <Panel key={k.plant} title={k.plant} icon="🏭 ">
                                <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:10, marginBottom:14 }}>
                                    {[
                                        { l:"OEE",        v:`${k.oee}%`,  c:"var(--acc)" },
                                        { l:"Uptime",     v:`${k.uptime}%`,c:"var(--green)" },
                                        { l:"Efficiency", v:`${k.efficiency}%`,c:"var(--yellow)" },
                                        { l:"Yield",      v:`${k.yield}%`,c:"var(--orange)" },
                                    ].map((item,i) => (
                                        <div key={i} style={{ background:"var(--surf2)", borderRadius:8, padding:"10px 12px" }}>
                                            <div style={{ fontFamily:"var(--mono)", fontSize:20, fontWeight:700, color:item.c }}>{item.v}</div>
                                            <div style={{ fontSize:10, color:"var(--text2)", marginTop:3 }}>{item.l}</div>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ fontSize:11, color:"var(--text2)", fontFamily:"var(--mono)", paddingTop:8, borderTop:"1px solid var(--border)" }}>
                                    {k.batches} batches completed this month
                                </div>
                            </Panel>
                        ))}
                    </div>

                    <Panel title="Overall KPI Comparison" icon="📈 ">
                        <div style={{ overflowX:"auto" }}>
                            <table className="tbl">
                                <thead><tr><th>Plant</th><th>OEE</th><th>Uptime</th><th>Efficiency</th><th>Batches</th><th>Yield</th><th>Score</th></tr></thead>
                                <tbody>
                                {KPIS.map(k => {
                                    const score = ((k.oee + k.uptime + k.efficiency + k.yield) / 4).toFixed(1);
                                    const color = +score > 95 ? "var(--green)" : +score > 88 ? "var(--yellow)" : "var(--red)";
                                    return (
                                        <tr key={k.plant}>
                                            <td style={{ fontWeight:700 }}>{k.plant}</td>
                                            <td style={{ fontFamily:"var(--mono)", color:"var(--acc)" }}>{k.oee}%</td>
                                            <td style={{ fontFamily:"var(--mono)", color:"var(--green)" }}>{k.uptime}%</td>
                                            <td style={{ fontFamily:"var(--mono)", color:"var(--yellow)" }}>{k.efficiency}%</td>
                                            <td style={{ fontFamily:"var(--mono)", color:"var(--text2)" }}>{k.batches}</td>
                                            <td style={{ fontFamily:"var(--mono)", color:"var(--orange)" }}>{k.yield}%</td>
                                            <td><span style={{ fontFamily:"var(--mono)", fontSize:14, fontWeight:700, color }}>{score}%</span></td>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </table>
                        </div>
                    </Panel>
                </>
            )}

            {tab === "reports" && (
                <Panel title="Report Library" icon="📄 " action={<button className="btn-primary" style={{ fontSize:12, padding:"6px 14px" }}>+ Generate New</button>}>
                    <table className="tbl">
                        <thead><tr><th>Report ID</th><th>Name</th><th>Type</th><th>Date</th><th>Size</th><th>Status</th><th>Actions</th></tr></thead>
                        <tbody>
                        {REPORT_DATA.map(r => (
                            <tr key={r.id}>
                                <td style={{ fontFamily:"var(--mono)", color:"var(--acc)", fontSize:11 }}>{r.id}</td>
                                <td style={{ fontSize:13, fontWeight:600 }}>{r.name}</td>
                                <td><span style={{ padding:"2px 7px", borderRadius:4, fontSize:9, fontFamily:"var(--mono)", fontWeight:700, background:"rgba(0,212,255,0.1)", color:"var(--acc)", letterSpacing:1 }}>{r.type.toUpperCase()}</span></td>
                                <td style={{ fontFamily:"var(--mono)", fontSize:11, color:"var(--text2)" }}>{r.date}</td>
                                <td style={{ fontFamily:"var(--mono)", fontSize:11, color:"var(--text2)" }}>{r.size}</td>
                                <td>
                    <span style={{
                        padding:"2px 8px", borderRadius:4, fontSize:9, fontWeight:700,
                        fontFamily:"var(--mono)", letterSpacing:1,
                        background: r.status==="ready" ? "rgba(0,240,160,0.12)" : "rgba(255,225,53,0.12)",
                        color: r.status==="ready" ? "var(--green)" : "var(--yellow)",
                    }}>
                      {r.status === "generating" ? "⟳ GENERATING" : "✓ READY"}
                    </span>
                                </td>
                                <td style={{ display:"flex", gap:6 }}>
                                    {r.status === "ready" && <button className="btn-sm" style={{ fontSize:10 }}>📥 Download</button>}
                                    <button className="btn-sm" style={{ fontSize:10 }}>👁 View</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </Panel>
            )}

            {tab === "compare" && (
                <div className="g2 mb">
                    <Panel title="OEE Breakdown by Plant" icon="📊 ">
                        {KPIS.map(k => (
                            <div key={k.plant} style={{ marginBottom:18 }}>
                                <div style={{ fontSize:14, fontWeight:700, marginBottom:10 }}>{k.plant}</div>
                                <ProgressRow label="OEE"        value={k.oee}        color="var(--acc)"/>
                                <ProgressRow label="Uptime"     value={k.uptime}     color="var(--green)"/>
                                <ProgressRow label="Efficiency" value={k.efficiency} color="var(--yellow)"/>
                                <ProgressRow label="Yield"      value={k.yield}      color="var(--orange)"/>
                            </div>
                        ))}
                    </Panel>

                    <Panel title="Benchmark vs Industry" icon="🏆 ">
                        {[
                            { label:"OEE",            yours:88.4, industry:75.0, best:94.0 },
                            { label:"Uptime",         yours:96.3, industry:91.0, best:99.2 },
                            { label:"Product Yield",  yours:96.4, industry:93.5, best:99.0 },
                            { label:"Energy Eff.",    yours:84.0, industry:78.0, best:92.0 },
                        ].map(row => (
                            <div key={row.label} style={{ marginBottom:16, paddingBottom:14, borderBottom:"1px solid rgba(28,47,82,0.4)" }}>
                                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                                    <span style={{ fontSize:13, fontWeight:700 }}>{row.label}</span>
                                    <div style={{ display:"flex", gap:14, fontSize:10, fontFamily:"var(--mono)" }}>
                                        <span style={{ color:"var(--acc)" }}>YOU {row.yours}%</span>
                                        <span style={{ color:"var(--text2)" }}>IND {row.industry}%</span>
                                        <span style={{ color:"var(--green)" }}>BEST {row.best}%</span>
                                    </div>
                                </div>
                                <div style={{ position:"relative", height:10, background:"var(--surf3)", borderRadius:5 }}>
                                    <div style={{ position:"absolute", left:0, top:0, height:"100%", width:`${row.industry}%`, background:"rgba(100,120,160,0.3)", borderRadius:5 }}/>
                                    <div style={{ position:"absolute", left:0, top:0, height:"100%", width:`${row.yours}%`, background:"var(--acc)", borderRadius:5 }}/>
                                    <div style={{ position:"absolute", left:`${row.best}%`, top:-2, width:2, height:14, background:"var(--green)", borderRadius:1 }}/>
                                </div>
                            </div>
                        ))}
                    </Panel>
                </div>
            )}
        </>
    );
}
