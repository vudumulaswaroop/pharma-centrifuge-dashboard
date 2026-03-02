export function KV({ k, v, color }) {
    return (
        <div className="detail-kv">
            <div className="detail-k">{k}</div>
            <div className="detail-v" style={color ? { color } : {}}>{v}</div>
        </div>
    );
}
