import {useCallback, useEffect, useRef, useState} from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from "recharts";
import {
    CHANNEL_COLORS,
    CHANNELS,
    EMAIL_COOLDOWN_MS,
    FLOW_ALERT_PCT,
    TANK_MAX_L,
    TANK_MAX_PCT,
    TANK_MIN_PCT,
    TEMP_ALERT_DEG
} from "../constants";
import {fmtInt, initChannel, now, nowFull} from "../constants/Helpers";
import {Clock} from "../components/Clock";
import {Tank} from "../components/Tank";
import {ChannelCard} from "../components/ChannelCard";
import {MotorPanel} from "../components/MotorPanel";
import {EmailPanel} from "../components/EmailPanel";
import {AlertFeed} from "../components/AlertFeed";

export function AppUtilityMonitor() {
    const [channels, setChannels] = useState(() =>
        CHANNELS.reduce((acc, l) => ({ ...acc, [l]: initChannel(l) }), {})
    );
    const [tankLevel, setTankLevel] = useState(13500);
    const [motorOn, setMotorOn] = useState(false);
    const [motorMode, setMotorMode] = useState("auto");
    const [runSeconds, setRunSeconds] = useState(0);
    const [startsToday, setStartsToday] = useState(0);
    const [alerts, setAlerts] = useState([
        { icon: "✅", msg: "System initialized. PLC-01, HMI-01 online. All 8 flow meters active.", type: "ok", time: now() },
        { icon: "📡", msg: "UFM-OA/OB/OC/OD and UFM-IA/IB/IC/ID calibrated and streaming.", type: "info", time: now() },
    ]);
    const [flowHistory, setFlowHistory] = useState([]);
    const [tempHistory, setTempHistory] = useState([]);
    const [logRows, setLogRows] = useState([]);
    const [emailTo, setEmailTo] = useState("operator@utility.com");
    const [emailCc, setEmailCc] = useState("manager@utility.com");
    const [emailLog, setEmailLog] = useState("");
    const lastEmailRef = useRef({});
    const tickRef = useRef(0);

    const addAlert = useCallback((icon, msg, type) => {
        setAlerts(prev => [{ icon, msg, type, time: now() }, ...prev].slice(0, 50));
    }, []);

    const triggerEmail = useCallback((subject, body) => {
        const key = subject.slice(0, 40);
        const last = lastEmailRef.current[key] || 0;
        if (Date.now() - last < EMAIL_COOLDOWN_MS) return;
        lastEmailRef.current[key] = Date.now();
        setEmailLog(`${nowFull()} — ${subject}`);
        addAlert("📧", `Email sent: "${subject}" → ${emailTo}`, "info");
        // In production: call your SMTP API here
        // fetch('/api/send-email', { method:'POST', body: JSON.stringify({ to: emailTo, cc: emailCc, subject, body }) })
    }, [emailTo, addAlert]);

    // Simulate PLC polling
    useEffect(() => {
        const id = setInterval(() => {
            const dt = 3; // seconds per tick
            tickRef.current++;

            setChannels(prev => {
                const next = {};
                for (const label of CHANNELS) {
                    const ch = prev[label];
                    const oFlow = Math.max(0.5, ch.outlet.flow + (Math.random() - 0.5) * 1.2);
                    const iFlow = Math.max(0.5, ch.inflow.flow + (Math.random() - 0.5) * 1.0);
                    const oTemp = +(ch.outlet.temp + (Math.random() - 0.5) * 0.3).toFixed(1);
                    const iTemp = +(ch.inflow.temp + (Math.random() - 0.5) * 0.4).toFixed(1);

                    // Occasional spikes
                    const spikeFlow = Math.random() < 0.03;
                    const spikeTemp = Math.random() < 0.04;
                    const finalOFlow = spikeFlow ? oFlow * (1 + (Math.random() > 0.5 ? 0.12 : -0.12)) : oFlow;
                    const finalITemp = spikeTemp ? iTemp + (Math.random() > 0.5 ? 7 : -7) : iTemp;

                    const flowDiffPct = oFlow > 0 ? ((finalOFlow - iFlow) / oFlow) * 100 : 0;
                    const tempDiff = finalOFlow > 0 ? (oTemp - finalITemp) : 0;

                    next[label] = {
                        ...ch,
                        outlet: { flow: +finalOFlow.toFixed(2), temp: oTemp, cumul: ch.outlet.cumul + finalOFlow * (dt / 60) },
                        inflow: { flow: +iFlow.toFixed(2), temp: finalITemp, cumul: ch.inflow.cumul + iFlow * (dt / 60) },
                        flowDiffPct: +flowDiffPct.toFixed(2),
                        tempDiff: +tempDiff.toFixed(1),
                        flowAlert: Math.abs(flowDiffPct) > FLOW_ALERT_PCT,
                        tempAlert: Math.abs(tempDiff) > TEMP_ALERT_DEG,
                    };

                    // Email triggers
                    if (Math.abs(flowDiffPct) > FLOW_ALERT_PCT) {
                        triggerEmail(
                            `FLOW DIFF ALERT — Channel O${label}/I${label}`,
                            `Channel O${label} outlet: ${finalOFlow.toFixed(2)} L/min, I${label} inflow: ${iFlow.toFixed(2)} L/min. Difference: ${flowDiffPct.toFixed(2)}% (threshold: ${FLOW_ALERT_PCT}%). Time: ${nowFull()}`
                        );
                    }
                    if (Math.abs(tempDiff) > TEMP_ALERT_DEG) {
                        triggerEmail(
                            `TEMP DIFF ALERT — Channel O${label}/I${label}`,
                            `Channel O${label} temp: ${oTemp}°C, I${label} temp: ${finalITemp}°C. Difference: ${Math.abs(tempDiff).toFixed(1)}°C (threshold: ${TEMP_ALERT_DEG}°C). Time: ${nowFull()}`
                        );
                    }
                }
                return next;
            });

            // Tank physics
            setChannels(current => {
                const totalOut = Object.values(current).reduce((s, ch) => s + ch.outlet.flow, 0);
                const totalIn = Object.values(current).reduce((s, ch) => s + ch.inflow.flow, 0);
                setTankLevel(prev => {
                    const netLpm = motorOn ? totalIn - totalOut : -totalOut;
                    const delta = netLpm * (dt / 60);
                    const next = Math.max(0, Math.min(TANK_MAX_L, prev + delta));

                    // Auto motor
                    const pct = (next / TANK_MAX_L) * 100;
                    if (motorMode === "auto") {
                        setMotorOn(was => {
                            if (!was && pct <= TANK_MIN_PCT) {
                                setStartsToday(s => s + 1);
                                addAlert("⚡", `AUTO START: Tank at ${pct.toFixed(1)}% (≤${TANK_MIN_PCT}%)`, "warn");
                                return true;
                            }
                            if (was && pct >= TANK_MAX_PCT) {
                                addAlert("🛑", `AUTO STOP: Tank at ${pct.toFixed(1)}% (≥${TANK_MAX_PCT}%)`, "warn");
                                return false;
                            }
                            return was;
                        });
                    }
                    return next;
                });
                return current;
            });

            setMotorOn(on => { if (on) setRunSeconds(s => s + dt); return on; });

            // Chart history (every tick)
            if (tickRef.current % 1 === 0) {
                const t = now();
                setFlowHistory(prev => {
                    const entry = { t };
                    for (const l of CHANNELS) entry[`O${l}`] = 0; // will be filled after channels update
                    return [...prev.slice(-25), entry];
                });
                setChannels(cur => {
                    setFlowHistory(prev => {
                        if (!prev.length) return prev;
                        const entry = { t: prev[prev.length - 1]?.t || now() };
                        for (const l of CHANNELS) {
                            entry[`O${l}`] = +cur[l]?.outlet.flow.toFixed(2) || 0;
                            entry[`I${l}`] = +cur[l]?.inflow.flow.toFixed(2) || 0;
                        }
                        return [...prev.slice(-24), entry];
                    });
                    setTempHistory(prev => {
                        const entry = { t: now() };
                        for (const l of CHANNELS) {
                            entry[`OT${l}`] = cur[l]?.outlet.temp || 0;
                            entry[`IT${l}`] = cur[l]?.inflow.temp || 0;
                        }
                        const lvl = { ...entry, tank: +((tankLevel / TANK_MAX_L) * 100).toFixed(1) };
                        return [...prev.slice(-24), lvl];
                    });
                    return cur;
                });
            }

            // Log rows (every 3 ticks)
            if (tickRef.current % 3 === 0) {
                setChannels(cur => {
                    setLogRows(prev => {
                        const row = {
                            time: now(),
                            channels: CHANNELS.map(l => ({
                                l,
                                oF: cur[l]?.outlet.flow.toFixed(2),
                                iF: cur[l]?.inflow.flow.toFixed(2),
                                oT: cur[l]?.outlet.temp,
                                iT: cur[l]?.inflow.temp,
                                fd: cur[l]?.flowDiffPct.toFixed(1),
                                td: cur[l]?.tempDiff.toFixed(1),
                                fa: cur[l]?.flowAlert,
                                ta: cur[l]?.tempAlert,
                            }))
                        };
                        return [row, ...prev].slice(0, 10);
                    });
                    return cur;
                });
            }
        }, 3000);
        return () => clearInterval(id);
    }, [motorOn, motorMode, tankLevel, addAlert, triggerEmail]);

    const handleSetMotor = useCallback((cmd) => {
        if (cmd === "on") { setMotorOn(true); setMotorMode("manual"); setStartsToday(s => s + 1); addAlert("⚡", "Motor manually STARTED", "ok"); }
        else if (cmd === "off") { setMotorOn(false); setMotorMode("manual"); addAlert("🛑", "Motor manually STOPPED", "warn"); }
        else { setMotorMode("auto"); addAlert("🤖", "Motor set to AUTO mode", "info"); }
    }, [addAlert]);

    const tankPct = (tankLevel / TANK_MAX_L) * 100;
    const totalOutFlow = Object.values(channels).reduce((s, ch) => s + (ch.outlet?.flow || 0), 0);
    const totalInFlow = Object.values(channels).reduce((s, ch) => s + (ch.inflow?.flow || 0), 0);
    const totalOutCumul = Object.values(channels).reduce((s, ch) => s + (ch.outlet?.cumul || 0), 0);
    const activeAlerts = Object.values(channels).filter(ch => ch.flowAlert || ch.tempAlert).length;

    return (
        <>
            <div className="scada-root">
                {/* HEADER */}
                <header className="hdr">
                    <div className="hdr-logo">App<span>Utility</span>Moniotor<span style={{ fontSize: "0.55rem", marginLeft: 8, color: "var(--text3)" }}>TECH</span></div>
                    <div className="hdr-title">
                        <h1>UTILITY WATER MANAGEMENT SYSTEM</h1>
                        <p>SCADA · PLC/HMI · 4-Channel Ultrasonic Flow + Temperature Monitoring</p>
                    </div>
                    <Clock />
                </header>

                {/* DEVICE STATUS BAR */}
                <div className="devbar">
                    {["PLC-01 ONLINE", "HMI-01 ACTIVE"].map(d => (
                        <div className="dev" key={d}><div className="dev-dot on" />{d}</div>
                    ))}
                    <div className="dev-sep" />
                    {CHANNELS.map(l => (
                        <div className="dev" key={`O${l}`}><div className="dev-dot on" /><span style={{ color: CHANNEL_COLORS[l] }}>UFM-O{l}</span></div>
                    ))}
                    <div className="dev-sep" />
                    {CHANNELS.map(l => (
                        <div className="dev" key={`I${l}`}><div className="dev-dot on" /><span style={{ color: CHANNEL_COLORS[l] }}>UFM-I{l}</span></div>
                    ))}
                    <div className="dev-sep" />
                    <div className="dev"><div className={`dev-dot ${activeAlerts > 0 ? "warn" : "on"}`} />{activeAlerts > 0 ? `${activeAlerts} ALERT(S) ACTIVE` : "ALL CLEAR"}</div>
                    <div className="dev-sep" />
                    <div className="dev"><div className={`dev-dot ${motorOn ? "on" : "warn"}`} />PUMP-01 {motorOn ? "RUNNING" : "STOPPED"}</div>
                </div>

                <div className="main">
                    {/* KPI STRIP */}
                    <div className="kpi-strip">
                        {[
                            { v: `${totalOutFlow.toFixed(1)} L/m`, l: "Total Outlet Flow" },
                            { v: `${totalInFlow.toFixed(1)} L/m`, l: "Total Inflow" },
                            { v: `${fmtInt(totalOutCumul)} L`, l: "Total Outlet Today" },
                            { v: `${tankPct.toFixed(1)}%`, l: "Tank Level" },
                            { v: motorOn ? "RUNNING" : "STOPPED", l: "Pump Status", c: motorOn ? "var(--ok)" : "var(--danger)" },
                            { v: `${activeAlerts}`, l: "Active Alerts", c: activeAlerts > 0 ? "var(--danger)" : "var(--ok)" },
                        ].map(({ v, l, c }) => (
                            <div className="kpi" key={l}>
                                <div className="kpi-val" style={c ? { color: c } : {}}>{v}</div>
                                <div className="kpi-lbl">{l}</div>
                            </div>
                        ))}
                    </div>

                    {/* TOP ROW: Tank | Channel Cards | Motor */}
                    <div className="top-row">
                        <div className="panel">
                            <div className="panel-hdr"><div className="panel-title">Utility Tank — 20,000 L</div></div>
                            <Tank level={tankLevel} motorOn={motorOn} />
                        </div>

                        <div className="panel">
                            <div className="panel-hdr">
                                <div className="panel-title">4-Channel Flow + Temperature Monitor (O=Outlet, I=Inflow)</div>
                                <div style={{ display: "flex", gap: 6 }}>
                  <span style={{ fontSize: "0.6rem", color: "var(--danger)", fontFamily: "var(--mono)" }}>
                    FLOW ALERT &gt;{FLOW_ALERT_PCT}%
                  </span>
                                    <span style={{ fontSize: "0.6rem", color: "var(--warn)", fontFamily: "var(--mono)", marginLeft: 8 }}>
                    TEMP ALERT &gt;{TEMP_ALERT_DEG}°C
                  </span>
                                </div>
                            </div>
                            <div className="ch-grid">
                                {CHANNELS.map(l => (
                                    <ChannelCard key={l} ch={channels[l]} label={l} />
                                ))}
                            </div>
                        </div>

                        <div className="panel">
                            <div className="panel-hdr"><div className="panel-title">Motor Pump Control</div></div>
                            <MotorPanel
                                motorOn={motorOn} motorMode={motorMode}
                                runSeconds={runSeconds} startsToday={startsToday}
                                tankPct={tankPct}
                                onSetMotor={handleSetMotor}
                            />
                        </div>
                    </div>

                    {/* MID ROW: Flow Chart | Temp Chart */}
                    <div className="mid-row">
                        <div className="panel">
                            <div className="panel-hdr"><div className="panel-title">Outlet Flow Rates — All Channels (L/min)</div></div>
                            <div className="chart-wrap">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={flowHistory} margin={{ top: 4, right: 12, left: -10, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="t" tick={{ fontSize: 9 }} interval="preserveStartEnd" />
                                        <YAxis tick={{ fontSize: 9 }} />
                                        <Tooltip
                                            contentStyle={{ background: "#071420", border: "1px solid #0d3a52", fontSize: 11, fontFamily: "Share Tech Mono" }}
                                            labelStyle={{ color: "#4a7a96" }}
                                        />
                                        <Legend wrapperStyle={{ fontSize: 10, fontFamily: "Share Tech Mono" }} />
                                        {CHANNELS.map(l => (
                                            <Line key={`O${l}`} type="monotone" dataKey={`O${l}`} name={`Out-${l}`} stroke={CHANNEL_COLORS[l]} strokeWidth={2} dot={false} />
                                        ))}
                                        {CHANNELS.map(l => (
                                            <Line key={`I${l}`} type="monotone" dataKey={`I${l}`} name={`In-${l}`} stroke={CHANNEL_COLORS[l]} strokeWidth={1} strokeDasharray="4 2" dot={false} />
                                        ))}
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="panel">
                            <div className="panel-hdr"><div className="panel-title">Temperature History — All Channels (°C)</div></div>
                            <div className="chart-wrap">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={tempHistory} margin={{ top: 4, right: 12, left: -10, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="t" tick={{ fontSize: 9 }} interval="preserveStartEnd" />
                                        <YAxis tick={{ fontSize: 9 }} />
                                        <Tooltip
                                            contentStyle={{ background: "#071420", border: "1px solid #0d3a52", fontSize: 11, fontFamily: "Share Tech Mono" }}
                                        />
                                        <Legend wrapperStyle={{ fontSize: 10, fontFamily: "Share Tech Mono" }} />
                                        {CHANNELS.map(l => (
                                            <Line key={`OT${l}`} type="monotone" dataKey={`OT${l}`} name={`OTemp-${l}`} stroke={CHANNEL_COLORS[l]} strokeWidth={2} dot={false} />
                                        ))}
                                        {CHANNELS.map(l => (
                                            <Line key={`IT${l}`} type="monotone" dataKey={`IT${l}`} name={`ITemp-${l}`} stroke={CHANNEL_COLORS[l]} strokeWidth={1} strokeDasharray="4 2" dot={false} />
                                        ))}
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* TANK LEVEL TREND */}
                    <div className="panel">
                        <div className="panel-hdr"><div className="panel-title">Tank Level Trend (%)</div></div>
                        <div className="chart-wrap" style={{ height: 120 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={tempHistory} margin={{ top: 4, right: 12, left: -10, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="tankGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#00e5ff" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#00e5ff" stopOpacity={0.02} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="t" tick={{ fontSize: 9 }} interval="preserveStartEnd" />
                                    <YAxis domain={[0, 100]} tick={{ fontSize: 9 }} />
                                    <Tooltip contentStyle={{ background: "#071420", border: "1px solid #0d3a52", fontSize: 11, fontFamily: "Share Tech Mono" }} />
                                    <Area type="monotone" dataKey="tank" name="Tank %" stroke="#00e5ff" fill="url(#tankGrad)" strokeWidth={2} dot={false} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* BOT ROW: Alerts | Data Log | Email */}
                    <div className="bot-row">
                        <div className="panel">
                            <div className="panel-hdr"><div className="panel-title">Alert Feed</div></div>
                            <AlertFeed alerts={alerts} />
                        </div>

                        <div className="panel">
                            <div className="panel-hdr"><div className="panel-title">Data Log</div></div>
                            <div className="log-scroll">
                                <table className="log-table">
                                    <thead>
                                    <tr>
                                        <th>Time</th>
                                        <th>Ch</th>
                                        <th>O-Flow</th>
                                        <th>I-Flow</th>
                                        <th>O-Temp</th>
                                        <th>I-Temp</th>
                                        <th>ΔFlow%</th>
                                        <th>ΔTemp°C</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {logRows.flatMap(row =>
                                        row.channels.map(ch => (
                                            <tr key={`${row.time}-${ch.l}`}>
                                                <td style={{ color: "var(--text3)" }}>{row.time}</td>
                                                <td style={{ color: CHANNEL_COLORS[ch.l], fontWeight: 700 }}>{ch.l}</td>
                                                <td>{ch.oF}</td>
                                                <td>{ch.iF}</td>
                                                <td>{ch.oT}</td>
                                                <td>{ch.iT}</td>
                                                <td className={ch.fa ? "col-alert" : "col-ok"}>{ch.fd}%</td>
                                                <td className={ch.ta ? "col-alert" : Math.abs(ch.td) > 2 ? "col-warn" : "col-ok"}>{ch.td}°C</td>
                                            </tr>
                                        ))
                                    )}
                                    {logRows.length === 0 && (
                                        <tr><td colSpan={8} style={{ textAlign: "center", color: "var(--text3)" }}>Collecting data…</td></tr>
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="panel">
                            <div className="panel-hdr"><div className="panel-title">Email Notifications</div></div>
                            <EmailPanel
                                channels={channels}
                                emailTo={emailTo} setEmailTo={setEmailTo}
                                emailCc={emailCc} setEmailCc={setEmailCc}
                                emailLog={emailLog}
                                onSendTest={(prefs) => {
                                    setEmailLog(`${nowFull()} — TEST EMAIL`);
                                    addAlert("📧", `Test email sent to ${emailTo}`, "info");
                                }}
                                onSendReport={(prefs) => {
                                    const lines = CHANNELS.map(l =>
                                        `Ch-${l}: OutFlow=${channels[l]?.outlet.flow.toFixed(2)}L/m InFlow=${channels[l]?.inflow.flow.toFixed(2)}L/m OutTemp=${channels[l]?.outlet.temp}°C InTemp=${channels[l]?.inflow.temp}°C ΔFlow=${channels[l]?.flowDiffPct.toFixed(1)}% ΔTemp=${channels[l]?.tempDiff.toFixed(1)}°C`
                                    ).join(" | ");
                                    setEmailLog(`${nowFull()} — Manual Report`);
                                    addAlert("📧", `Report emailed: Tank=${tankPct.toFixed(1)}% | ${lines}`, "info");
                                }}
                            />
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}
