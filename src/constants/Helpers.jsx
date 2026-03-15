
export const signJWT = (user) => {
    const payload = { id: user.id, role: user.role, name: user.name, plant: user.plant, email: user.email, avatar: user.avatar, dept: user.dept, exp: Date.now() + 3_600_000 };
    return `eyJhbGciOiJIUzI1NiJ9.${btoa(JSON.stringify(payload))}.SIG_${user.id}_${Date.now()}`;
};
export const parseJWT = (token) => {
    try { return JSON.parse(atob(token.split(".")[1])); } catch { return null; }
};
export const verifyJWT = (token) => {
    const p = parseJWT(token);
    return p && p.exp > Date.now() ? p : null;
};

export const fmt2 = (v) => (typeof v === "number" ? v.toFixed(2) : "--");
export const fmt1 = (v) => (typeof v === "number" ? v.toFixed(1) : "--");
export const fmtInt = (v) => (typeof v === "number" ? Math.round(v).toLocaleString() : "--");
export const now = () => new Date().toLocaleTimeString("en-GB");
export const nowFull = () => new Date().toLocaleString("en-GB");

export function initChannel(label) {
    return {
        label,
        outlet: { flow: 10 + Math.random() * 8, temp: 22 + Math.random() * 2, cumul: 0 },
        inflow: { flow: 10 + Math.random() * 8, temp: 22 + Math.random() * 2, cumul: 0 },
        flowDiffPct: 0,
        tempDiff: 0,
        flowAlert: false,
        tempAlert: false,
        lastEmailFlow: 0,
        lastEmailTemp: 0,
    };
}
