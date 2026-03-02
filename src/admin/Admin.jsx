import {useState} from "react";
import {StatCard} from "../ui/StatCard";
import {UsersTab} from "./UsersTab";
import {MachinesTab} from "./MachinesTab";
import {RolesTab} from "./RolesTab";
import {SystemTab} from "./SystemTab";
import {LogsTab} from "./LogsTab";
import {MACHINES, USERS} from "../constants";

export function Admin() {
    const [tab, setTab] = useState("users");

    return (
        <>
            <div className="breadcrumb">
                <span>CentroMon</span><span className="bc-sep">/</span><span>Admin Panel</span>
            </div>

            <div className="stats-row" style={{ gridTemplateColumns:"repeat(4,1fr)" }}>
                <StatCard label="Total Users"     value={USERS.length}    sub="active accounts" icon="👥" color="var(--acc)"/>
                <StatCard label="Machines"        value={MACHINES.length} sub="registered"      icon="⚙" color="var(--green)"/>
                <StatCard label="DB Size"         value="2.1 TB"          sub="metrics stored"  icon="🗄" color="var(--yellow)"/>
                <StatCard label="System Uptime"   value="99.97%"          sub="last 30 days"    icon="📡" color="var(--purple)"/>
            </div>

            <div className="tabs">
                {[["users","👥 Users"],["machines","⚙ Machines"],["roles","🛡 Roles"],["system","💻 System"],["logs","📋 Audit Logs"]].map(([id, lbl]) => (
                    <button key={id} className={`tab ${tab===id?"active":""}`} onClick={() => setTab(id)}>{lbl}</button>
                ))}
            </div>

            {tab === "users"    && <UsersTab/>}
            {tab === "machines" && <MachinesTab/>}
            {tab === "roles"    && <RolesTab/>}
            {tab === "system"   && <SystemTab/>}
            {tab === "logs"     && <LogsTab/>}
        </>
    );
}
