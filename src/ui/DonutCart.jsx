export function DonutChart({ segments = [], size = 100 }) {
    const cx = size / 2, cy = size / 2, r = size * 0.37, gap = 0.04;
    let cumAngle = -Math.PI / 2;
    const total = segments.reduce((a, s) => a + s.value, 0);
    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {segments.map((seg, i) => {
                const angle     = (seg.value / total) * (Math.PI * 2 - gap * segments.length);
                const startA    = cumAngle + gap / 2;
                const endA      = startA + angle;
                const x1 = cx + r * Math.cos(startA), y1 = cy + r * Math.sin(startA);
                const x2 = cx + r * Math.cos(endA),   y2 = cy + r * Math.sin(endA);
                const large = angle > Math.PI ? 1 : 0;
                cumAngle += angle + gap;
                return (
                    <path key={i}
                          d={`M ${x1.toFixed(2)},${y1.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${x2.toFixed(2)},${y2.toFixed(2)}`}
                          fill="none" stroke={seg.color} strokeWidth={size * 0.09} strokeLinecap="round"
                    />
                );
            })}
            <text x={cx} y={cy + 4} textAnchor="middle" fill="#dce8ff"
                  fontSize={size * 0.14} fontWeight="700" fontFamily="'JetBrains Mono',monospace">
                {segments[0]?.label || ""}
            </text>
        </svg>
    );
}
