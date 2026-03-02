import {AUDIT_LOGS} from "../constants";
import {Panel} from "../ui/Panel";

export function LogsTab() {
    return (
        <Panel title="Audit Trail" icon="📋 " meta="Last 50 events">
            {AUDIT_LOGS.map((l, i) => (
                <div key={i} className="log-row">
                    <span style={{ color:"var(--text3)", fontFamily:"var(--mono)", width:68, flexShrink:0 }}>{l.ts}</span>
                    <span style={{ fontFamily:"var(--mono)", fontSize:11, width:54, flexShrink:0,
                        color: l.level === "ERROR" ? "var(--red)" : l.level === "WARN" ? "var(--yellow)" : "var(--text2)" }}>
            {l.level}
          </span>
                    <span style={{ fontFamily:"var(--mono)", fontSize:11, color:"var(--acc)", width:160, flexShrink:0 }}>{l.action}</span>
                    <span style={{ color:"var(--text)", flex:1 }}>{l.detail}</span>
                    <span style={{ color:"var(--text3)", fontFamily:"var(--mono)", fontSize:10, flexShrink:0 }}>{l.user}</span>
                </div>
            ))}
        </Panel>
    );
}
