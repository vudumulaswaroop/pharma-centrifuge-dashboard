export function SDot({ status }) {
    const map = { running: "g", idle: "n", warning: "r", healthy: "g", warning2: "y", error: "r" };
    return <span className={`sdot ${map[status] || "n"}`}/>;
}
