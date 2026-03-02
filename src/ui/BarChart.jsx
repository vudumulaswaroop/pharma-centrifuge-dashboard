export function BarChart({ data = [], color = "#00d4ff", height = 90 }) {
    if (!data.length) return null;
    const max = Math.max(...data.map(d => d.value)) || 1;
    const W = data.length * 28, H = height;
    return (
        <svg viewBox={`0 0 ${W} ${H}`} className="chart-svg" preserveAspectRatio="none" style={{ height }}>
            {data.map((d, i) => {
                const barH = ((d.value / max) * (H - 18)).toFixed(1);
                const x    = i * 28 + 4;
                return (
                    <g key={i}>
                        <rect x={x} y={(H - 14 - +barH).toFixed(1)} width={20} height={barH} rx="3"
                              fill={d.color || color} opacity="0.75"/>
                        <text x={x + 10} y={H - 1} textAnchor="middle" fill="#2d4470" fontSize="7"
                              fontFamily="'JetBrains Mono',monospace">{d.label}</text>
                    </g>
                );
            })}
        </svg>
    );
}
