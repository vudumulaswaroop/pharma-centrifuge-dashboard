import {TANK_MAX_PCT, TANK_MIN_PCT} from "../constants";

export function MotorPanel({ motorOn, motorMode, runSeconds, startsToday, tankPct, onSetMotor }) {
    return (
        <div className="motor-wrap">
            <div className={`motor-ring-outer ${motorOn ? "running" : ""}`}>
                <div className={`motor-ring-spin ${motorOn ? "spinning" : ""}`} />
                <div className="motor-ring-inner">
                    <span>PUMP-01</span>
                    <span className={`mstate ${motorOn ? "running" : "stopped"}`}>
            {motorOn ? "ON" : "OFF"}
          </span>
                </div>
            </div>

            <div className="motor-info">
                {[
                    { l: "Mode", v: motorMode.toUpperCase() },
                    { l: "Tank Level", v: `${tankPct.toFixed(1)}%` },
                    { l: "Run Hours", v: `${(runSeconds / 3600).toFixed(2)} h` },
                    { l: "Starts Today", v: `${startsToday}` },
                    { l: "Auto ON at", v: `≤ ${TANK_MIN_PCT}%` },
                    { l: "Auto OFF at", v: `≥ ${TANK_MAX_PCT}%` },
                ].map(({ l, v }) => (
                    <div className="mrow" key={l}>
                        <span className="mrow-lbl">{l}</span>
                        <span className="mrow-val">{v}</span>
                    </div>
                ))}
            </div>

            <div className="motor-btns">
                <button
                    className={`mbtn ${motorMode === "manual" && motorOn ? "active-on" : ""}`}
                    onClick={() => onSetMotor("on")}
                >START</button>
                <button
                    className={`mbtn ${motorMode === "manual" && !motorOn ? "active-off" : ""}`}
                    onClick={() => onSetMotor("off")}
                >STOP</button>
                <button
                    className={`mbtn ${motorMode === "auto" ? "active-auto" : ""}`}
                    onClick={() => onSetMotor("auto")}
                >AUTO</button>
            </div>

            <div className="auto-hint">
                Auto mode: pump starts when<br />
                tank <span>≤25%</span>, stops when <span>≥90%</span>
            </div>
        </div>
    );
}
