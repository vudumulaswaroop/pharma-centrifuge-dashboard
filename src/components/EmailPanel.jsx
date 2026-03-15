import {useState} from "react";
import {FLOW_ALERT_PCT, TEMP_ALERT_DEG} from "../constants";

export function EmailPanel({ channels, emailTo, setEmailTo, emailCc, setEmailCc, onSendTest, onSendReport, emailLog }) {
    const [status, setStatus] = useState({ txt: "", cls: "" });
    const [chkFlow, setChkFlow] = useState(true);
    const [chkTemp, setChkTemp] = useState(true);
    const [chkTank, setChkTank] = useState(true);
    const [chkMotor, setChkMotor] = useState(false);

    const doSend = (fn) => {
        fn({ chkFlow, chkTemp, chkTank, chkMotor });
        setStatus({ txt: `✅ Email triggered → ${emailTo}`, cls: "sent" });
        setTimeout(() => setStatus({ txt: "", cls: "" }), 5000);
    };

    return (
        <div className="email-body">
            <div className="erow">
                <span className="elbl">To</span>
                <input className="einput" value={emailTo} onChange={e => setEmailTo(e.target.value)} placeholder="operator@plant.com" />
            </div>
            <div className="erow">
                <span className="elbl">CC</span>
                <input className="einput" value={emailCc} onChange={e => setEmailCc(e.target.value)} placeholder="manager@plant.com" />
            </div>

            <div className="ethr-row">
                <div className="ethr">
                    <span className="ethr-lbl">Flow Δ Alert</span>
                    <span className="ethr-val alert">&gt; {FLOW_ALERT_PCT}%</span>
                </div>
                <div className="ethr">
                    <span className="ethr-lbl">Temp Δ Alert</span>
                    <span className="ethr-val warn">&gt; {TEMP_ALERT_DEG}°C</span>
                </div>
            </div>

            <div style={{ fontSize: "0.6rem", color: "var(--text2)", letterSpacing: "1px", textTransform: "uppercase" }}>
                Active Triggers
            </div>
            <div className="echk-grid">
                {[
                    { lbl: "Flow Diff", v: chkFlow, s: setChkFlow },
                    { lbl: "Temp Diff", v: chkTemp, s: setChkTemp },
                    { lbl: "Tank Level", v: chkTank, s: setChkTank },
                    { lbl: "Motor Events", v: chkMotor, s: setChkMotor },
                ].map(({ lbl, v, s }) => (
                    <label className="echk" key={lbl}>
                        <input type="checkbox" checked={v} onChange={e => s(e.target.checked)} />
                        {lbl}
                    </label>
                ))}
            </div>

            <div className="ebtn-row">
                <button className="ebtn primary" onClick={() => doSend(onSendTest)}>SEND TEST</button>
                <button className="ebtn secondary" onClick={() => doSend(onSendReport)}>SEND REPORT</button>
            </div>

            {status.txt && <div className={`estatus visible ${status.cls}`}>{status.txt}</div>}

            <div className="elog">Last: {emailLog || "No emails sent yet"}</div>
        </div>
    );
}
