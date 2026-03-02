import {Panel} from "../ui/Panel";
import {useState} from "react";
import {USERS} from "../constants";

export function UsersTab() {
    const [showAdd, setShowAdd] = useState(false);
    return (
        <Panel title="User Management" icon="👥 "
               action={<button className="btn-primary" style={{ fontSize:12, padding:"6px 14px" }} onClick={() => setShowAdd(s => !s)}>+ Add User</button>}>

            {showAdd && (
                <div style={{ background:"var(--surf2)", border:"1px solid var(--border)", borderRadius:10, padding:18, marginBottom:18 }}>
                    <div style={{ fontSize:13, fontWeight:700, marginBottom:14, color:"var(--acc)" }}>New User</div>
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
                        {["Full Name","Email Address","Plant / Location"].map(f => (
                            <div key={f} className="form-row" style={{ marginBottom:0 }}>
                                <label className="form-lbl">{f}</label>
                                <input className="form-input" placeholder={f}/>
                            </div>
                        ))}
                    </div>
                    <div style={{ display:"flex", gap:8, marginTop:14 }}>
                        <button className="btn-primary" style={{ fontSize:12, padding:"6px 14px" }}>Create User</button>
                        <button className="btn-sm" onClick={() => setShowAdd(false)}>Cancel</button>
                    </div>
                </div>
            )}

            {USERS.map(u => (
                <div key={u.id} className="user-row">
                    <div className="u-avatar">{u.avatar}</div>
                    <div style={{ flex:1 }}>
                        <div className="u-name">{u.name}</div>
                        <div className="u-email">{u.email} · {u.dept} · {u.plant}</div>
                    </div>
                    <span className={`sidebar-user-role role-${u.role}`} style={{ padding:"3px 9px" }}>{u.role.toUpperCase()}</span>
                    <span style={{ fontSize:10, color:"var(--green)", fontFamily:"var(--mono)", marginRight:6 }}>● Active</span>
                    <button className="btn-sm" style={{ fontSize:10 }}>Edit</button>
                    <button className="btn-sm btn-danger" style={{ fontSize:10 }}>Revoke</button>
                </div>
            ))}
        </Panel>
    );
}
