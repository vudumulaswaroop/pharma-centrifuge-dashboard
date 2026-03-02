export function statusColor(s) {
    return s === "running" ? "var(--green)" : s === "warning" ? "var(--red)" : "var(--text3)";
}
