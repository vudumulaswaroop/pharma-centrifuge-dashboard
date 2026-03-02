import {useMemo} from "react";
import {Sparkline} from "../ui/SparkLine";
import {Panel} from "../ui/Panel";
import {ProgressRow} from "../ui/ProgressRow";
import {generateHistory24h} from "../constants";
import {StatCard} from "../ui/StatCard";
import {MultiLineChart} from "../ui/MultiLineChart";
import {AlertItem} from "../ui/AlertItem";
import {statusColor} from "../ui/statusColor";

export function Overview({ metrics, alerts, user, onAck }) {
    const running  = metrics.filter(m => m.status === "running").length;
    const warning  = metrics.filter(m => m.status === "warning").length;
    // const idle     = metrics.filter(m => m.status === "idle").length;
    const avgEff   = (metrics.reduce((a, m) => a + m.efficiency, 0) / metrics.length).toFixed(1);
    const unack    = alerts.filter(a => !a.ack).length;
    const h24      = useMemo(() => generateHistory24h(), []);
    const hours    = h24.map((_, i) => i % 4 === 0 ? `${String(i).padStart(2,"0")}:00` : "");

    return (
        <>
            <div className="breadcrumb">
                <span>CentroMon</span>
                <span className="bc-sep">/</span>
                <span>Fleet Overview</span>
            </div>

            {/* KPI Row */}
            <div className="stats-row">
                <StatCard label="Running Machines" value={running}    sub={`of ${metrics.length} total`}    icon="⚙" color="var(--green)"/>
                <StatCard label="Active Warnings"  value={warning}    sub="require attention"               icon="⚠" color="var(--yellow)"/>
                <StatCard label="Fleet Efficiency" value={`${avgEff}%`} sub="weighted average"              icon="📊" color="var(--acc)"/>
                <StatCard label="Unack'd Alerts"   value={unack}      sub="pending review"                  icon="🔔" color="var(--red)"/>
                <StatCard label="OEE Score"        value="87.4%"      sub="overall equipment effectiveness" icon="🏭" color="var(--orange)"/>
            </div>

            {/* Trend charts */}
            <div className="g2 mb">
                <Panel title="RPM — 24h Fleet Trend" icon="📈 " meta="Average across all running machines">
                    <div className="chart-box">
                        <MultiLineChart height={130} datasets={[
                            { data: h24.map(h => h.rpm),  color: "var(--acc)" },
                            { data: h24.map(h => h.rpm * 0.96), color: "var(--acc2)", },
                        ]}/>
                        <div className="chart-axis">
                            {hours.map((l, i) => <span key={i}>{l}</span>)}
                        </div>
                    </div>
                </Panel>

                <Panel title="Temperature & Efficiency" icon="🌡 " meta="°C and % overlay">
                    <div className="chart-box">
                        <MultiLineChart height={130} datasets={[
                            { data: h24.map(h => h.temp),       color: "var(--orange)" },
                            { data: h24.map(h => h.efficiency),  color: "var(--green)" },
                        ]}/>
                        <div className="chart-axis">
                            {hours.map((l, i) => <span key={i}>{l}</span>)}
                        </div>
                    </div>
                </Panel>
            </div>

            {/* Alerts + Fleet table */}
            <div className="g65 mb">
                <Panel title="Active Alerts" icon="🚨 " meta={`${unack} unacknowledged`}>
                    <div className="alert-list">
                        {alerts.slice(0, 5).map(a => (
                            <AlertItem key={a.id} alert={a} onAck={onAck}/>
                        ))}
                    </div>
                </Panel>

                <Panel title="Fleet Status" icon="⚙ ">
                    <table className="tbl">
                        <thead>
                        <tr>
                            <th>ID</th><th>Plant</th><th>Status</th><th>Eff%</th><th>Next Maint.</th>
                        </tr>
                        </thead>
                        <tbody>
                        {metrics.map(m => (
                            <tr key={m.id}>
                                <td style={{ fontWeight: 700, fontFamily: "var(--mono)", color: "var(--acc)", fontSize: 12 }}>{m.id}</td>
                                <td style={{ fontSize: 11, color: "var(--text2)" }}>{m.plant}</td>
                                <td>
                                    <span className="sdot" style={{ background: statusColor(m.status), boxShadow: `0 0 6px ${statusColor(m.status)}` }}/>
                                    <span style={{ fontSize: 11, fontFamily: "var(--mono)" }}>{m.status.toUpperCase()}</span>
                                </td>
                                <td className="tbl-acc" style={{ fontSize: 12 }}>{m.efficiency}%</td>
                                <td style={{ fontSize: 10, color: m.nextMaintDays < 5 ? "var(--yellow)" : "var(--text2)", fontFamily: "var(--mono)" }}>
                                    {m.nextMaintDays < 0 ? "OVERDUE" : `${m.nextMaintDays}d`}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </Panel>
            </div>

            {/* Plant efficiency */}
            <div className="g2 mb">
                <Panel title="Plant Efficiency Breakdown" icon="🏭 ">
                    {["Plant A","Plant B","Plant C"].map(p => {
                        const mlist = metrics.filter(m => m.plant === p);
                        const eff   = mlist.length ? +(mlist.reduce((a,m) => a + m.efficiency, 0) / mlist.length).toFixed(1) : 0;
                        return <ProgressRow key={p} label={p} value={eff}/>;
                    })}
                    <ProgressRow label="Fleet Average" value={+avgEff} color="var(--acc)"/>
                </Panel>

                <Panel title="Production Throughput" icon="📊 " meta="Hourly batches">
                    <div className="chart-box">
                        <Sparkline data={h24.map(h => h.throughput)} color="var(--green)" height={110}/>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginTop: 14 }}>
                        {[
                            { l: "Batches Today",    v: "142",    c: "var(--acc)" },
                            { l: "Avg Duration",     v: "3.2h",   c: "var(--green)" },
                            { l: "Product Yield",    v: "96.4%",  c: "var(--yellow)" },
                        ].map((item, i) => (
                            <div key={i} style={{ background: "var(--surf2)", borderRadius: 8, padding: "10px 12px" }}>
                                <div style={{ fontFamily: "var(--mono)", fontSize: 18, fontWeight: 700, color: item.c }}>{item.v}</div>
                                <div style={{ fontSize: 10, color: "var(--text2)", marginTop: 3 }}>{item.l}</div>
                            </div>
                        ))}
                    </div>
                </Panel>
            </div>
        </>
    );
}
