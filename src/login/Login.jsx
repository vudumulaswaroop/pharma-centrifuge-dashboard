import {useState} from "react";
import { USERS} from "../constants";
import {signJWT} from "../constants/Helpers";

export function Login({ onLogin }) {
    const [email, setEmail]     = useState("");
    const [pass,  setPass]      = useState("");
    const [error, setError]     = useState("");
    const [loading, setLoading] = useState(false);

    const attempt = () => {
        setError("");
        if (!email || !pass) return setError("Please enter credentials.");
        setLoading(true);
        setTimeout(() => {
            const user = USERS.find(u => u.email === email && u.password === pass);
            if (!user) { setLoading(false); return setError("Invalid email or password."); }
            onLogin(signJWT(user), user);
        }, 600);
    };

    const quickFill = (u) => { setEmail(u.email); setPass(u.password); setError(""); };

    return (
        <div className="login-wrap">
            <div className="login-bg-grid"/>
            <div className="login-bg-glow"/>

            <div className="login-card">
                <div className="login-logo-row">
                    <div className="login-logo-box">⚙</div>
                    <div>
                        <div className="login-brand">Pharma Dashboard</div>
                        <div className="login-brand-sub">Pharma Industrial Suite</div>
                    </div>
                </div>

                <h1 className="login-title">Secure Access</h1>
                <p className="login-sub">Authenticate to access the centrifuge monitoring platform</p>

                <div className="form-row">
                    <label className="form-lbl">Email Address</label>
                    <input className="form-input" type="email" value={email} placeholder="user@pharma.com"
                           onChange={e => { setEmail(e.target.value); setError(""); }}
                           onKeyDown={e => e.key === "Enter" && attempt()}/>
                </div>

                <div className="form-row">
                    <label className="form-lbl">Password</label>
                    <input className="form-input" type="password" value={pass} placeholder="••••••••"
                           onChange={e => { setPass(e.target.value); setError(""); }}
                           onKeyDown={e => e.key === "Enter" && attempt()}/>
                </div>

                {error && <div className="login-err">⚠ {error}</div>}

                <button className="login-btn" onClick={attempt} disabled={loading}>
                    {loading ? "VERIFYING…" : "AUTHENTICATE →"}
                </button>

                <div className="login-divider"><span>DEMO ACCOUNTS</span></div>
                <div className="login-demo-title">Select a role to auto-fill credentials</div>
                <div className="demo-pills">
                    {USERS.map(u => (
                        <div key={u.id} className="demo-pill" onClick={() => quickFill(u)}>
                            <strong>{u.role.toUpperCase()}</strong> — {u.name}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
