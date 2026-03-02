import {useMemo} from "react";
import {generateBatchHistory, generateHistory24h, PRODUCTS} from "../constants";
import {StatCard} from "../ui/StatCard";
import {Panel} from "../ui/Panel";
import {Sparkline} from "../ui/SparkLine";
import {DonutChart} from "../ui/DonutCart";
import {ProgressRow} from "../ui/ProgressRow";

export function Analytics({ metrics }) {
    const h24     = useMemo(() => generateHistory24h(), []);
    const batches = useMemo(() => generateBatchHistory(), []);
    const avgEff  = (metrics.reduce((a, m) => a + m.efficiency, 0) / metrics.length).toFixed(1);
    const avgRpm  = (metrics.filter(m=>m.status==="running").reduce((a,m)=>a+m.rpm,0) / Math.max(metrics.filter(m=>m.status==="running").length,1)).toFixed(0);
    const totalPow= metrics.reduce((a,m) => a + m.power, 0).toFixed(1);

    const prodDist = PRODUCTS.map((p, i) => ({
        name: p,
        count: batches.filter(b => b.product === p).length,
        color: ["var(--acc)","var(--green)","var(--yellow)","var(--orange)","var(--purple)","var(--red)"][i],
    }));

    const hours = h24.map((_, i) => i % 6 === 0 ? `${String(i).padStart(2,"0")}:00` : "");

    return (
        <>
            <div className="breadcrumb">
                <span>CentroMon</span><span className="bc-sep">/</span><span>Production Analytics</span>
            </div>

            <div className="stats-row">
                <StatCard label="Batches Today"     value="142"          sub="completed + in progress" icon="🧪" color="var(--acc)"/>
                <StatCard label="Avg Efficiency"    value={`${avgEff}%`} sub="across all machines"     icon="📊" color="var(--green)"/>
                <StatCard label="Avg RPM"           value={avgRpm}       sub="running machines"         icon="⚙" color="var(--yellow)"/>
                <StatCard label="Total Power"       value={`${totalPow}kW`} sub="fleet consumption"     icon="⚡" color="var(--orange)"/>
                <StatCard label="OEE"               value="87.4%"        sub="availability × perf × qual" icon="🏆" color="var(--purple)"/>
            </div>

            {/* Main charts */}
            <div className="g2 mb">
                <Panel title="Throughput — 24h" icon="📈 " meta="Batches per hour">
                    <div className="chart-box">
                        <Sparkline data={h24.map(h => h.throughput)} color="var(--green)" height={130}/>
                    </div>
                    <div className="chart-axis">{hours.map((l,i)=><span key={i}>{l}</span>)}</div>
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginTop:14 }}>
                        {[
                            {l:"Total Today",   v:"142",     c:"var(--acc)"},
                            {l:"Peak Hourly",   v:"9",       c:"var(--green)"},
                            {l:"Avg Duration",  v:"3.2h",    c:"var(--yellow)"},
                        ].map((item,i) => (
                            <div key={i} style={{ background:"var(--surf2)", borderRadius:8, padding:"10px 12px" }}>
                                <div style={{ fontFamily:"var(--mono)", fontSize:18, fontWeight:700, color:item.c }}>{item.v}</div>
                                <div style={{ fontSize:10, color:"var(--text2)", marginTop:3 }}>{item.l}</div>
                            </div>
                        ))}
                    </div>
                </Panel>

                <Panel title="Efficiency Trend" icon="📊 " meta="Fleet average %">
                    <div className="chart-box">
                        <Sparkline data={h24.map(h => h.efficiency)} color="var(--acc)" height={130}/>
                    </div>
                    <div className="chart-axis">{hours.map((l,i)=><span key={i}>{l}</span>)}</div>
                </Panel>
            </div>

            {/* Plant breakdown + product dist */}
            <div className="g2 mb">
                <Panel title="Plant Efficiency Comparison" icon="🏭 ">
                    {["Plant A","Plant B","Plant C"].map(p => {
                        const mlist = metrics.filter(m => m.plant === p);
                        const eff = mlist.length ? +(mlist.reduce((a,m)=>a+m.efficiency,0)/mlist.length).toFixed(1) : 0;
                        const running = mlist.filter(m=>m.status==="running").length;
                        return (
                            <div key={p} style={{ marginBottom:16 }}>
                                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5, alignItems:"center" }}>
                                    <span style={{ fontSize:14, fontWeight:700 }}>{p}</span>
                                    <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                                        <span style={{ fontSize:10, color:"var(--green)", fontFamily:"var(--mono)" }}>{running} running</span>
                                        <span style={{ fontFamily:"var(--mono)", fontSize:14, color: eff>92?"var(--green)":eff>80?"var(--yellow)":"var(--red)" }}>{eff}%</span>
                                    </div>
                                </div>
                                <ProgressRow label="" value={eff}/>
                            </div>
                        );
                    })}
                </Panel>

                <Panel title="Product Distribution" icon="🧬 ">
                    <div style={{ display:"flex", alignItems:"center", gap:20 }}>
                        <DonutChart size={110} segments={prodDist.map(p => ({ value: p.count || 1, color: p.color, label: "" }))}/>
                        <div style={{ flex:1 }}>
                            {prodDist.map((p, i) => (
                                <div key={i} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:7 }}>
                                    <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                                        <span style={{ width:8, height:8, borderRadius:"50%", background:p.color, display:"inline-block", boxShadow:`0 0 5px ${p.color}` }}/>
                                        <span style={{ fontSize:12, color:"var(--text2)" }}>{p.name}</span>
                                    </div>
                                    <span style={{ fontFamily:"var(--mono)", fontSize:11, color:p.color }}>{p.count} batch{p.count!==1?"es":""}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </Panel>
            </div>

            {/* Batch history */}
            <Panel title="Recent Batch Log" icon="📋 " meta="Last 12 batches">
                <table className="tbl">
                    <thead>
                    <tr><th>Batch ID</th><th>Product</th><th>Machine</th><th>Started</th><th>Duration</th><th>Yield</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                    {batches.map((b, i) => (
                        <tr key={i}>
                            <td style={{ fontFamily:"var(--mono)", color:"var(--acc)", fontSize:12 }}>{b.batch}</td>
                            <td style={{ fontSize:12, fontWeight:600 }}>{b.product}</td>
                            <td style={{ fontFamily:"var(--mono)", fontSize:11, color:"var(--text2)" }}>{b.machine}</td>
                            <td style={{ fontFamily:"var(--mono)", fontSize:11, color:"var(--text2)" }}>{b.started}</td>
                            <td style={{ fontFamily:"var(--mono)", fontSize:12 }}>{b.duration}h</td>
                            <td style={{ fontFamily:"var(--mono)", fontSize:12, color: +b.yield > 95 ? "var(--green)" : "var(--yellow)" }}>{b.yield}%</td>
                            <td>
                  <span style={{
                      padding:"2px 8px", borderRadius:4, fontSize:9, fontWeight:700,
                      background: b.status === "completed" ? "rgba(0,240,160,0.12)" : "rgba(0,212,255,0.12)",
                      color: b.status === "completed" ? "var(--green)" : "var(--acc)",
                      fontFamily:"var(--mono)", letterSpacing:1,
                  }}>
                    {b.status.toUpperCase()}
                  </span>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </Panel>
        </>
    );
}
