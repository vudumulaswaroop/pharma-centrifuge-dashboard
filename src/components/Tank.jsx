import {TANK_MAX_L, TANK_MAX_PCT, TANK_MIN_PCT} from "../constants";
import {fmtInt} from "../constants/Helpers";

export function Tank({ level, motorOn }) {
    const pct = (level / TANK_MAX_L) * 100;
    const fillClass = pct < TANK_MIN_PCT ? "low" : pct > TANK_MAX_PCT ? "high" : "";
    const statusColor = pct < TANK_MIN_PCT ? "var(--danger)" : pct > TANK_MAX_PCT ? "var(--warn)" : "var(--ok)";
    const statusTxt = pct < TANK_MIN_PCT ? "CRITICAL LOW" : pct > TANK_MAX_PCT ? "OVERFLOW RISK" : "NORMAL";

    return (
        <div className="tank-outer">
            <div style={{ position: "relative" }}>
                <div className="tank-container">
                    <div
                        className={`tank-water ${fillClass}`}
                        style={{ height: `${Math.min(100, pct).toFixed(1)}%` }}
                    />
                    {/* Min line at 25% */}
                    <div className="marker-line" style={{ bottom: "25%" }}>
                        <div className="marker-line-inner" style={{ background: "var(--warn)", opacity: 0.8 }} />
                    </div>
                    {/* Max line at 90% */}
                    <div className="marker-line" style={{ bottom: "90%" }}>
                        <div className="marker-line-inner" style={{ background: "var(--danger)", opacity: 0.8 }} />
                    </div>
                    <div className="tank-pct-lbl">{pct.toFixed(1)}%</div>
                </div>
                <div className="tank-scale">
                    {["100%", "75%", "MAX 90%", "50%", "MIN 25%", "0%"].map((l, i) => (
                        <span key={i} style={{ color: l.includes("MAX") ? "var(--danger)" : l.includes("MIN") ? "var(--warn)" : undefined }}>
              {l}
            </span>
                    ))}
                </div>
            </div>
            <div className="tank-stats">
                {[
                    { l: "Volume", v: `${fmtInt(level)} L` },
                    { l: "Capacity", v: "20,000 L" },
                    { l: "Level", v: `${pct.toFixed(1)}%`, c: statusColor },
                    { l: "Status", v: statusTxt, c: statusColor },
                    { l: "Min Thresh", v: "5,000 L / 25%" },
                    { l: "Max Thresh", v: "18,000 L / 90%" },
                    { l: "Motor", v: motorOn ? "RUNNING ▶" : "STOPPED ■", c: motorOn ? "var(--ok)" : "var(--danger)" },
                ].map(({ l, v, c }) => (
                    <div className="tstat" key={l}>
                        <span className="tstat-lbl">{l}</span>
                        <span className="tstat-val" style={c ? { color: c } : {}}>{v}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
