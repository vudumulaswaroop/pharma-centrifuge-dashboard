import {CHANNEL_COLORS, FLOW_ALERT_PCT, TEMP_ALERT_DEG} from "../constants";
import {fmt1, fmt2} from "../constants/Helpers";

export function ChannelCard({ ch, label }) {
    const { outlet, inflow, flowDiffPct, tempDiff, flowAlert, tempAlert } = ch;
    const color = CHANNEL_COLORS[label];
    const flowWarn = Math.abs(flowDiffPct) > FLOW_ALERT_PCT;
    const tempWarn = Math.abs(tempDiff) > TEMP_ALERT_DEG;

    return (
        <div className={`ch-card ${label}`}>
            <div className="ch-header">
                <div>
                    <div className={`ch-id ${label}`}>O{label} / I{label}</div>
                    <div style={{ fontSize: "0.58rem", color: "var(--text3)", marginTop: 2 }}>
                        UFM-O{label} · UFM-I{label} · TS-O{label} · TS-I{label}
                    </div>
                </div>
                <div className="ch-badges">
          <span className={`badge ${flowWarn ? "alert" : "ok"}`}>
            FLOW {flowWarn ? "⚠" : "✓"}
          </span>
                    <span className={`badge ${tempWarn ? "alert" : "ok"}`}>
            TEMP {tempWarn ? "⚠" : "✓"}
          </span>
                </div>
            </div>

            <div className="ch-metrics">
                <div className="metric">
                    <div className="metric-lbl">Outlet Flow</div>
                    <div className="metric-val" style={{ color }}>{fmt2(outlet.flow)}</div>
                    <div className="metric-sub">L/min</div>
                </div>
                <div className="metric">
                    <div className="metric-lbl">Inflow</div>
                    <div className="metric-val" style={{ color: "var(--text)" }}>{fmt2(inflow.flow)}</div>
                    <div className="metric-sub">L/min</div>
                </div>
                <div className="metric">
                    <div className="metric-lbl">Outlet Temp</div>
                    <div className="metric-val" style={{ color }}>{fmt1(outlet.temp)}°C</div>
                    <div className="metric-sub">TS-O{label}</div>
                </div>
                <div className="metric">
                    <div className="metric-lbl">Inflow Temp</div>
                    <div className="metric-val" style={{ color: "var(--text)" }}>{fmt1(inflow.temp)}°C</div>
                    <div className="metric-sub">TS-I{label}</div>
                </div>
            </div>

            <div className="diff-row">
                <div className={`diff-pill ${flowWarn ? "alert" : "ok"}`}>
                    <span>ΔFlow</span>
                    <span>{flowDiffPct > 0 ? "+" : ""}{fmt1(flowDiffPct)}%</span>
                </div>
                <div className={`diff-pill ${tempWarn ? "alert" : Math.abs(tempDiff) > 2 ? "warn" : "ok"}`}>
                    <span>ΔTemp</span>
                    <span>{tempDiff > 0 ? "+" : ""}{fmt1(tempDiff)}°C</span>
                </div>
                <div className="diff-pill ok">
                    <span>Usage</span>
                    <span>{fmt2(outlet.flow)} L/m</span>
                </div>
            </div>
        </div>
    );
}
