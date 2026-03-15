import {useEffect, useState} from "react";
import {now} from "../constants/Helpers";

export function Clock() {
    const [t, setT] = useState({ time: now(), date: "" });
    useEffect(() => {
        const id = setInterval(() => {
            const d = new Date();
            setT({
                time: d.toLocaleTimeString("en-GB"),
                date: d.toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short", year: "numeric" }),
            });
        }, 1000);
        return () => clearInterval(id);
    }, []);
    return (
        <div className="hdr-right">
            <span className="clock">{t.time}</span>
            <span style={{ fontSize: "0.65rem", display: "block" }}>{t.date}</span>
            <span style={{ marginTop: 4, display: "block", fontSize: "0.65rem" }}>
        <span className="online-dot" />SYSTEM ONLINE
      </span>
        </div>
    );
}
