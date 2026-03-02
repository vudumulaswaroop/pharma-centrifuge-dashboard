import {useMemo} from "react";
import {Tag} from "../ui/Tag";
import {generateHistory24h} from "../constants";
import {ArcGauge} from "../ui/ArcGauge";
import {KV} from "../ui/KV";
import {Panel} from "../ui/Panel";
import {Sparkline} from "../ui/SparkLine";

export function MachineDetail({ m, onBack }) {
    const h24  = useMemo(() => generateHistory24h(), []);
    const days = `${m.nextMaintDays < 0 ? "OVERDUE" : `In ${m.nextMaintDays} days`}`;
    const maintColor = m.nextMaintDays < 0 ? "var(--red)" : m.nextMaintDays < 7 ? "var(--yellow)" : "var(--green)";

    return (
        <>
            <div className="breadcrumb">
                <span className="bc-link" onClick={onBack}>Machines</span>
                <span className="bc-sep">/</span>
                <span>{m.name}</span>
                <span className="bc-sep">/</span>
                <span style={{ color: "var(--text2)" }}>{m.id}</span>
            </div>

            {/* Header row */}
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
                <div>
                    <h2 style={{ fontSize: 24, fontWeight: 700 }}>{m.name}</h2>
                    <div style={{ fontSize: 12, color: "var(--text2)", fontFamily: "var(--mono)", marginTop: 3 }}>
                        {m.model} · SN: {m.serialNo} · {m.plant}
                    </div>
                </div>
                <div style={{ marginLeft: "auto", display: "flex", gap: 10, alignItems: "center" }}>
                    <Tag label={m.status.toUpperCase()} type={m.status === "running" ? "green" : m.status === "warning" ? "red" : "gray"}/>
                    <Tag label={m.product} type="blue"/>
                    <Tag label={m.batchId} type="gray"/>
                </div>
            </div>

            {/* Gauges */}
            <div className="panel mb">
                <div className="panel-head">
                    <span className="panel-title">📡 Live Sensor Readings</span>
                    <span className="panel-meta" style={{ color: "var(--green)", display: "flex", alignItems: "center", gap: 6 }}>
            <span className="live-dot"/> REAL-TIME
          </span>
                </div>
                <div className="panel-body">
                    <div className="gauge-grid">
                        <ArcGauge value={+m.rpm.toFixed(0)}    max={6000}  label="SPEED"       color="var(--acc)"    unit="rpm" size={100}/>
                        <ArcGauge value={+m.temperature}        max={50}    label="TEMPERATURE" color="var(--orange)" unit="°C"  size={100}/>
                        <ArcGauge value={+m.vibration}          max={5}     label="VIBRATION"   color={m.vibration > 2 ? "var(--red)" : "var(--green)"} unit="G" size={100}/>
                        <ArcGauge value={+m.efficiency.toFixed(0)} max={100} label="EFFICIENCY" color="var(--green)"  unit="%"   size={100}/>
                        <ArcGauge value={+m.power}              max={4}     label="POWER"       color="var(--yellow)" unit="kW"  size={100}/>
                        <ArcGauge value={+m.pressure}           max={2}     label="PRESSURE"    color="var(--acc2)"   unit="bar" size={100}/>
                        <ArcGauge value={+m.torque}             max={40}    label="TORQUE"      color="var(--purple)" unit="Nm"  size={100}/>
                        <ArcGauge value={+m.current}            max={12}    label="CURRENT"     color="var(--orange)" unit="A"   size={100}/>
                    </div>
                </div>
            </div>

            {/* Electrical readings */}
            <div className="detail-kvs mb">
                <KV k="Voltage" v={`${m.voltage.toFixed(0)} V`} color="var(--yellow)"/>
                <KV k="Commission Year" v={m.commissionYear}/>
                <KV k="Capacity" v={m.capacity}/>
                <KV k="Run Hours" v={`${m.runHours} hrs`} color="var(--acc)"/>
                <KV k="Last Maintenance" v={m.lastMaintenance}/>
                <KV k="Next Maintenance" v={days} color={maintColor}/>
            </div>

            {/* Trend charts */}
            <div className="g2 mb">
                <Panel title="RPM Trend — 24h" icon="📈 " meta={`Avg: ${(h24.reduce((a,h)=>a+h.rpm,0)/h24.length).toFixed(0)} rpm`}>
                    <div className="chart-box">
                        <Sparkline data={h24.map(h => h.rpm)} color="var(--acc)" height={120}/>
                    </div>
                    <div className="chart-axis">
                        {["00:00","06:00","12:00","18:00","23:00"].map(l => <span key={l}>{l}</span>)}
                    </div>
                </Panel>

                <Panel title="Temperature — 24h" icon="🌡 " meta="°C over time">
                    <div className="chart-box">
                        <Sparkline data={h24.map(h => h.temp)} color="var(--orange)" height={120}/>
                    </div>
                    <div className="chart-axis">
                        {["00:00","06:00","12:00","18:00","23:00"].map(l => <span key={l}>{l}</span>)}
                    </div>
                </Panel>
            </div>

            {/* Vibration + Power */}
            <div className="g2 mb">
                <Panel title="Vibration — 24h" icon="〰 " meta="G-force">
                    <Sparkline data={h24.map(h => h.vibration)} color="var(--red)" height={100}/>
                </Panel>
                <Panel title="Power Draw — 24h" icon="⚡ " meta="kW">
                    <Sparkline data={h24.map(h => h.power)} color="var(--yellow)" height={100}/>
                </Panel>
            </div>

            {/* Maintenance log */}
            <Panel title="Maintenance Log" icon="🔧 ">
                {[
                    { title: "Last Full Inspection", meta: `${m.lastMaintenance} · Bearing lubrication, rotor balance check, seal inspection`, dot: "var(--green)" },
                    { title: "Upcoming Scheduled Service", meta: `${days} · Full overhaul + seal replacement + motor check`, dot: maintColor },
                    { title: "Total Operating Hours", meta: `${m.runHours} hours logged · Manufacturer overhaul recommended at 10,000h`, dot: "var(--acc)" },
                    { title: "Component Lifecycle", meta: "Rotor: 78% life · Seals: 81% life · Bearings: 65% life", dot: "var(--yellow)" },
                ].map((item, i) => (
                    <div key={i} className="tl-item" style={{ borderBottom: i < 3 ? "1px solid rgba(28,47,82,0.4)" : "none" }}>
                        <div className="tl-dot-wrap">
                            <div className="tl-dot" style={{ background: item.dot, boxShadow: `0 0 8px ${item.dot}` }}/>
                            {i < 3 && <div className="tl-line"/>}
                        </div>
                        <div>
                            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 3 }}>{item.title}</div>
                            <div style={{ fontSize: 11, color: "var(--text2)", fontFamily: "var(--mono)" }}>{item.meta}</div>
                        </div>
                    </div>
                ))}
            </Panel>
        </>
    );
}
