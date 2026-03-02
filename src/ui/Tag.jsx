export function Tag({ label, type = "blue" }) {
    return <span className={`tag tag-${type}`}>{label}</span>;
}
