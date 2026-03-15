import {useCallback, useEffect, useRef, useState} from "react";
import {generateAlerts, generateMetrics, MACHINES, POLL_MS} from "../constants";
import {Login} from "../login/Login";
import {Overview} from "../overview/Overview";
import {Machines} from "../machines/Machines";
import {Maintenance} from "../machines/Maintenance";
import {Analytics} from "../analytics/Analytics";
import {Reports} from "../reports/Reports";
import {Admin} from "../admin/Admin";
import {Topbar} from "../layout/Topbar";
import {Sidebar} from "../layout/Sidebar";
import {NotifPanel} from "./NotifPanel";
import {AppUtilityMonitor} from "./AppUtilityMonitor";
import {verifyJWT} from "../constants/Helpers";

export function AppMain() {
    // ─── Auth state ──────────────────────────────────────────────────────────
    const [token,  setToken]  = useState(() => {
        try { return localStorage.getItem("cm_token") || null; } catch { return null; }
    });
    const user = token ? verifyJWT(token) : null;

    // ─── App state ───────────────────────────────────────────────────────────
    const [view,    setView]    = useState("overview");
    const [metrics, setMetrics] = useState(() => MACHINES.map((m, i) => generateMetrics(m, i)));
    const [alerts,  setAlerts]  = useState(generateAlerts);
    const [clock,   setClock]   = useState(() => new Date().toLocaleTimeString([], { hour12: false }));
    const [showNotif, setShowNotif] = useState(false);
    const tick = useRef(0);

    // ─── Real-time simulation ─────────────────────────────────────────────────
    useEffect(() => {
        if (!user) return;
        const id = setInterval(() => {
            tick.current++;
            setMetrics(MACHINES.map((m, i) => generateMetrics(m, tick.current + i)));
            setClock(new Date().toLocaleTimeString([], { hour12: false }));
        }, POLL_MS);
        return () => clearInterval(id);
    }, [user]);

    // ─── Auth handlers ────────────────────────────────────────────────────────
    const handleLogin  = useCallback((tk) => {
        localStorage.setItem("cm_token", tk);
        setToken(tk);
        setView("overview");
    }, []);

    const handleLogout = useCallback(() => {
        localStorage.removeItem("cm_token");
        setToken(null);
        setView("overview");
    }, []);

    const ackAlert = useCallback((id) => {
        setAlerts(prev => prev.map(a => a.id === id ? { ...a, ack: true } : a));
    }, []);

    // ─── Guard: invalid / expired token ──────────────────────────────────────
    if (token && !user) {
        localStorage.removeItem("cm_token");
        return <><style></style><Login onLogin={handleLogin}/></>;
    }

    if (!user) {
        return <><style></style><Login onLogin={handleLogin}/></>;
    }
    // ─── Role guard on view ───────────────────────────────────────────────────
    const ROLE_VIEWS = {
        plant:   ["overview","machines","maintenance"],
        manager: ["overview","machines","maintenance","analytics"],
        head:    ["overview","machines","maintenance","analytics","reports"],
        admin:   ["overview","machines","maintenance","analytics","reports","admin"],
    };
    const safeView = ROLE_VIEWS[user.role]?.includes(view) ? view : "overview";

    const unackAlerts  = alerts.filter(a => !a.ack).length;
    const warningCount = metrics.filter(m => m.status === "warning").length;

    const views = {
        overview:    <Overview    metrics={metrics} alerts={alerts} user={user} onAck={ackAlert}/>,
        machines:    <Machines    metrics={metrics} user={user}/>,
        maintenance: <Maintenance metrics={metrics} alerts={alerts} onAck={ackAlert} user={user}/>,
        analytics:   <Analytics   metrics={metrics}/>,
        reports:     <Reports/>,
        admin:       <Admin/>,
    };

    return (
        <>
            {/* Extra inline for role labels in admin */}
            <style>{`
        .sidebar-user-role {
          display: inline-block; padding: 2px 7px; border-radius: 4px;
          font-size: 9px; font-weight: 700; letter-spacing: 1.5px;
          text-transform: uppercase; font-family: var(--mono);
        }
      `}</style>
            {user ? <AppUtilityMonitor/> : null}
            <div className="app-wrap">
                <Sidebar
                    user={user}
                    view={safeView}
                    onNav={setView}
                    onLogout={handleLogout}
                    alertCount={unackAlerts}
                    warningCount={warningCount}
                />

                <div className="main-wrap">
                    <Topbar
                        title={safeView}
                        time={clock}
                        alertCount={unackAlerts}
                        onNotif={() => setShowNotif(s => !s)}
                    />

                    <div className="content">
                        {views[safeView]}
                    </div>
                </div>
            </div>

            {showNotif && (
                <NotifPanel alerts={alerts} onAck={ackAlert} onClose={() => setShowNotif(false)}/>
            )}

        </>
    );
}
