import {Panel} from "../ui/Panel";
import {ROLE_CONFIG, USERS} from "../constants";

export function RolesTab() {
    return (
        <Panel title="Role & Permission Matrix" icon="🛡 ">
            <table className="tbl">
                <thead>
                <tr>
                    <th>Role</th><th>Label</th>
                    {["Overview","Machines","Maintenance","Analytics","Reports","Admin"].map(v => <th key={v}>{v}</th>)}
                    <th>Users</th>
                </tr>
                </thead>
                <tbody>
                {Object.entries(ROLE_CONFIG).map(([role, cfg]) => (
                    <tr key={role}>
                        <td><span className={`sidebar-user-role role-${role}`} style={{ padding:"3px 8px" }}>{role.toUpperCase()}</span></td>
                        <td style={{ fontSize:12, color:"var(--text2)" }}>{cfg.label}</td>
                        {["overview","machines","maintenance","analytics","reports","admin"].map(v => (
                            <td key={v} style={{ textAlign:"center", fontSize:14 }}>
                                {cfg.views.includes(v) ? <span style={{ color:"var(--green)" }}>✓</span> : <span style={{ color:"var(--text3)" }}>—</span>}
                            </td>
                        ))}
                        <td style={{ fontFamily:"var(--mono)", fontSize:12, color:"var(--acc)" }}>
                            {USERS.filter(u => u.role === role).length}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </Panel>
    );
}
