export const USERS = [
    { id: 1, email: "plant@pharma.com",   password: "plant123",   role: "plant",   name: "Ravi ",      plant: "Plant A", avatar: "RK", dept: "Operations" },
    { id: 2, email: "manager@pharma.com", password: "manager123", role: "manager", name: "Ranga Reddy",    plant: "All",     avatar: "PS", dept: "Production" },
    { id: 3, email: "head@pharma.com",    password: "head123",    role: "head",    name: "Bharat Reddy",    plant: "HQ",      avatar: "AM", dept: "Engineering" },
    { id: 4, email: "admin@pharma.com",   password: "admin123",   role: "admin",   name: "Admin User",      plant: "System",  avatar: "AU", dept: "IT" },
];
export const ROLE_CONFIG = {
    plant:   { label: "Plant Operator", color: "#00e5a0", bg: "rgba(0,229,160,0.12)", views: ["overview","machines","maintenance"] },
    manager: { label: "Plant Manager",  color: "#00c8ff", bg: "rgba(0,200,255,0.12)", views: ["overview","machines","maintenance","analytics"] },
    head:    { label: "Head of Ops",    color: "#ffd600", bg: "rgba(255,214,0,0.12)",  views: ["overview","machines","maintenance","analytics","reports"] },
    admin:   { label: "System Admin",   color: "#ff3b5c", bg: "rgba(255,59,92,0.12)",  views: ["overview","machines","maintenance","analytics","reports","admin"] },
};
export const MACHINES = [
    { id: "CF-001", name: "Centrifuge Alpha",   plant: "Plant A", model: "MTD 48",  capacity: "250Kg",  commissionYear: 2019, serialNo: "32" },
    { id: "CF-002", name: "Centrifuge Beta",    plant: "Plant A", model: "BL 48",   capacity: "300kg", commissionYear: 2020, serialNo: "44" },
    { id: "CF-003", name: "Centrifuge Gamma",   plant: "Plant B", model: "MTD 60",  capacity: "500Kg",  commissionYear: 2018, serialNo: "01" },
    { id: "CF-004", name: "Centrifuge Delta",   plant: "Plant B", model: "MTD 48",  capacity: "250Kg",   commissionYear: 2021, serialNo: "45" },
    { id: "CF-005", name: "Centrifuge Epsilon", plant: "Plant C", model: "BL 60",   capacity: "600kg",  commissionYear: 2020, serialNo: "55" },
    { id: "CF-006", name: "Centrifuge Zeta",    plant: "Plant C", model: "BD 60",   capacity: "700kg",  commissionYear: 2022, serialNo: "12" },
];
export const PLANTS   = ["Plant A", "Plant B", "Plant C"];
export const PRODUCTS = ["Insulin API", "Vaccine Buffer", "Plasma Fraction", "mRNA Lipid NP", "Enzyme Purification", "Monoclonal Ab"];

// ─── JWT helpers (browser-safe simulation) ───────────────────────────────

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

// ─── Metric generators ───────────────────────────────────────────────────

export const rnd  = (min, max, dec = 1) => +(Math.random() * (max - min) + min).toFixed(dec);
export const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

export const generateMetrics = (machine, t = 0) => {
    const wave  = Math.sin(t / 15) * 0.12;
    const roll  = Math.random();
    const status = roll > 0.88 ? "warning" : roll > 0.18 ? "running" : "idle";
    const rpm    = status === "running" ? rnd(200 + wave * 400, 200 + wave * 400) : status === "idle" ? 0 : rnd(600, 900);
    const temp   = rnd(18 + wave * 4, 28 + wave * 6);
    const vib    = status === "warning" ? rnd(2.8, 4.5) : rnd(0.2, 1.6);
    const power  = status === "running" ? rnd(1.9, 2.9) : rnd(0.05, 0.4);
    const eff    = status === "running" ? rnd(87, 99.5) : status === "idle" ? 0 : rnd(40, 70);
    return {
        ...machine,
        status,
        rpm,
        temperature: temp,
        vibration:   vib,
        power,
        pressure:    rnd(0.9, 1.6),
        efficiency:  eff,
        torque:      rnd(12, 28),
        speed:       rpm,
        current:     rnd(4.2, 8.8),
        voltage:     rnd(218, 242),
        runHours:    rnd(1200, 8800, 0),
        lastMaintenance: `${rnd(5, 90, 0)} days ago`,
        nextMaintDays:   rnd(-3, 45, 0),
        batchId:     `BATCH-${Math.floor(Math.random() * 9000) + 1000}`,
        product:     pick(PRODUCTS),
        uptime:      rnd(88, 99.9),
        alerts:      status === "warning" ? [pick(["High vibration","Temperature spike","RPM deviation","Bearing wear","Imbalance detected"])] : [],
        trend:       Array.from({ length: 20 }, (_, i) => rnd(rpm * 0.9, rpm * 1.05)),
    };
};

export const generateHistory24h = () =>
    Array.from({ length: 24 }, (_, i) => ({
        hour: `${String(i).padStart(2, "0")}:00`,
        rpm: rnd(0, 900), temp: rnd(19, 31), efficiency: rnd(86, 99),
        throughput: rnd(35, 100), vibration: rnd(0.3, 1.8), power: rnd(1.8, 2.7),
    }));

export const generateBatchHistory = () =>
    Array.from({ length: 12 }, (_, i) => ({
        batch: `BATCH-${8800 + i}`,
        product: pick(PRODUCTS),
        machine: pick(MACHINES).id,
        duration: rnd(1.5, 5.2),
        yield: rnd(88, 99.5),
        status: pick(["completed","completed","completed","completed","in-progress"]),
        started: new Date(Date.now() - (12 - i) * 3_600_000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }));

export const generateAlerts = () => [
    { id: 1, machine: "CF-003", type: "critical", msg: "Vibration exceeds 3.8G threshold", time: "09:42", ack: false, plant: "Plant B" },
    { id: 2, machine: "CF-001", type: "warning",  msg: "Temperature approaching 35°C limit", time: "10:15", ack: false, plant: "Plant A" },
    { id: 3, machine: "CF-005", type: "info",     msg: "Scheduled maintenance due in 3 days", time: "11:00", ack: true, plant: "Plant C" },
    { id: 4, machine: "CF-002", type: "warning",  msg: "Rotor imbalance — check load distribution", time: "11:30", ack: false, plant: "Plant A" },
    { id: 5, machine: "CF-006", type: "critical", msg: "Emergency stop triggered — door sensor", time: "12:05", ack: false, plant: "Plant C" },
    { id: 6, machine: "CF-004", type: "info",     msg: "RPM setpoint changed by operator", time: "12:40", ack: true, plant: "Plant B" },
    { id: 7, machine: "CF-001", type: "warning",  msg: "Seal wear indicator — 80% life used", time: "13:10", ack: false, plant: "Plant A" },
];

export const AUDIT_LOGS = [
    { ts: "14:32:01", user: "admin@pharma.com",   action: "USER_LOGIN",     detail: "Successful login from 192.168.1.45",      level: "INFO" },
    { ts: "14:28:15", user: "manager@pharma.com", action: "ALERT_ACK",      detail: "Alert #3 acknowledged",                   level: "INFO" },
    { ts: "13:55:42", user: "plant@pharma.com",   action: "MACHINE_CONFIG", detail: "CF-001 RPM setpoint updated to 5000",      level: "WARN" },
    { ts: "13:22:08", user: "system",             action: "EMERG_STOP",     detail: "CF-006 emergency stop — door sensor open", level: "ERROR" },
    { ts: "12:40:00", user: "plant@pharma.com",   action: "BATCH_START",    detail: "Batch BATCH-9012 started on CF-004",       level: "INFO" },
    { ts: "12:10:00", user: "admin@pharma.com",   action: "USER_CREATED",   detail: "New plant operator user created",          level: "INFO" },
    { ts: "11:58:33", user: "head@pharma.com",    action: "REPORT_EXPORT",  detail: "Monthly OEE report exported as PDF",       level: "INFO" },
    { ts: "11:05:21", user: "system",             action: "MAINT_ALERT",    detail: "CF-005 maintenance due in 3 days",         level: "WARN" },
];

export const SYSTEM_HEALTH = {
    apiServer:    { label: "API Server",        value: "99.97%",        sub: "Node.js 20 LTS · Express 4",      status: "healthy" },
    database:     { label: "PostgreSQL 15",     value: "Healthy",       sub: "Avg query: 2.1ms · 847 conn/hr",  status: "healthy" },
    jwtAuth:      { label: "JWT Auth (HS256)",  value: "Active",        sub: "Exp: 1hr · Refresh tokens on",    status: "healthy" },
    mqttBroker:   { label: "MQTT Broker",       value: "6/6 online",    sub: "TLS 1.3 · QoS 1 · 38msg/s",      status: "healthy" },
    timeseries:   { label: "InfluxDB",          value: "2.1TB used",    sub: "Retention: 90d · Write: 1.2k/s",  status: "healthy" },
    notifications:{ label: "Alert Engine",      value: "Running",       sub: "3 active rules · Slack+Email",    status: "warning" },
};

export const NAV = [
    { id: "overview",    icon: "⊞",  label: "Overview",     minRole: null },
    { id: "machines",    icon: "⚙",  label: "Machines",     minRole: null },
    { id: "maintenance", icon: "🔧", label: "Maintenance",   minRole: null },
    { id: "analytics",   icon: "📊", label: "Analytics",     minRole: "manager" },
    { id: "reports",     icon: "📄", label: "Reports",       minRole: "head" },
    { id: "admin",       icon: "🛡", label: "Admin",         minRole: "admin" },
];

export const REPORT_DATA = [
    { id: "RPT-001", name: "Monthly OEE Report — January 2026",    type: "OEE",        date: "2026-01-31", size: "2.4 MB", status: "ready" },
    { id: "RPT-002", name: "Fleet Efficiency Q4 2025",             type: "Efficiency",  date: "2025-12-31", size: "1.8 MB", status: "ready" },
    { id: "RPT-003", name: "Maintenance Summary — Dec 2025",       type: "Maintenance", date: "2025-12-31", size: "980 KB", status: "ready" },
    { id: "RPT-004", name: "Production Throughput — Feb 2026",     type: "Production",  date: "2026-02-28", size: "—",      status: "generating" },
    { id: "RPT-005", name: "Energy Consumption Report — Jan 2026", type: "Energy",      date: "2026-01-31", size: "1.1 MB", status: "ready" },
    { id: "RPT-006", name: "Vibration & Wear Analysis — Q4 2025",  type: "Predictive",  date: "2025-12-31", size: "3.1 MB", status: "ready" },
];

export const KPIS = [
    { plant:"Plant A", oee:91.2, uptime:98.1, efficiency:92.4, batches:58, yield:97.1 },
    { plant:"Plant B", oee:85.6, uptime:94.2, efficiency:86.8, batches:47, yield:95.8 },
    { plant:"Plant C", oee:88.3, uptime:96.7, efficiency:89.2, batches:37, yield:96.4 },
];

export const POLL_MS = 2800;


