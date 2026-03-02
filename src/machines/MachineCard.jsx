import {Sparkline} from "../ui/SparkLine";
import {statusColor} from "../ui/statusColor";

export function MachineCard({ m, onClick }) {
    const sc = statusColor(m.status);
    return (
        <div
            className={`mc ${m.status}`}
            style={{ "--s-color": sc }}
            onClick={() => onClick(m.id)}
        >
            <div className="mc-head">
                <div>
                    <div className="mc-name">{m.name}</div>
                    <div className="mc-model">{m.model} · {m.plant}</div>
                </div>
                <div className={`mc-badge ${m.status}`}>{m.status}</div>
            </div>

            {/* Mini sparkline */}
            <div className="mc-sparkline">
                <Sparkline data={m.trend} color={sc} height={28} fill={false}/>
            </div>

            <div className="mc-metrics">
                <div className="mc-m">
                    <div className="mc-m-val" style={{ color: "var(--acc)" }}>{m.rpm.toFixed(0)}</div>
                    <div className="mc-m-lbl">RPM</div>
                </div>
                <div className="mc-m">
                    <div className="mc-m-val" style={{ color: m.temperature > 30 ? "var(--orange)" : "var(--green)" }}>
                        {m.temperature}°C
                    </div>
                    <div className="mc-m-lbl">Temp</div>
                </div>
                <div className="mc-m">
                    <div className="mc-m-val" style={{ color: m.vibration > 2 ? "var(--red)" : "var(--green)" }}>
                        {m.vibration}G
                    </div>
                    <div className="mc-m-lbl">Vibration</div>
                </div>
                <div className="mc-m">
                    <div className="mc-m-val">{m.efficiency}%</div>
                    <div className="mc-m-lbl">Efficiency</div>
                </div>
                <div className="mc-m">
                    <div className="mc-m-val" style={{ color: "var(--yellow)" }}>{m.power}kW</div>
                    <div className="mc-m-lbl">Power</div>
                </div>
                <div className="mc-m">
                    <div className="mc-m-val" style={{ color: "var(--purple)" }}>{m.uptime}%</div>
                    <div className="mc-m-lbl">Uptime</div>
                </div>
            </div>

            <div className="mc-foot">
                <span className="mc-batch">{m.batchId}</span>
                <span className="mc-prod">{m.product}</span>
            </div>

            {m.alerts.length > 0 && (
                <div className="mc-alert-bar">⚠ {m.alerts[0]}</div>
            )}
        </div>
    );
}
