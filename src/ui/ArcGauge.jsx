export function ArcGauge({ value, max, label, color = "#00d4ff", unit = "", size = 90 }) {
    const pct    = Math.min(Math.max(value / max, 0), 1);
    const R      = size * 0.4;
    const cx     = size / 2, cy = size / 2;
    const start  = -220, sweep = 260;
    const toRad  = d => (d * Math.PI) / 180;
    const pt     = angle => {
        const a = toRad(angle - 90);
        return `${(cx + R * Math.cos(a)).toFixed(2)},${(cy + R * Math.sin(a)).toFixed(2)}`;
    };
    const endAngle = start + sweep * pct;
    const large1   = sweep > 180 ? 1 : 0;
    const large2   = sweep * pct > 180 ? 1 : 0;
    const trackEnd = start + sweep;

    return (
        <div className="gauge-wrap">
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: "visible" }}>
                <path
                    d={`M ${pt(start)} A ${R} ${R} 0 ${large1} 1 ${pt(trackEnd)}`}
                    fill="none" stroke="#162544" strokeWidth={size * 0.065} strokeLinecap="round"
                />
                {pct > 0 && (
                    <path
                        d={`M ${pt(start)} A ${R} ${R} 0 ${large2} 1 ${pt(endAngle)}`}
                        fill="none" stroke={color} strokeWidth={size * 0.065} strokeLinecap="round"
                    />
                )}
                <text x={cx} y={cy - 2} textAnchor="middle" fill={color}
                      fontSize={size * 0.165} fontWeight="700" fontFamily="'JetBrains Mono',monospace">{value}</text>
                <text x={cx} y={cy + size * 0.13} textAnchor="middle" fill="#6680aa"
                      fontSize={size * 0.095} fontFamily="'JetBrains Mono',monospace">{unit}</text>
            </svg>
            <div className="gauge-lbl">{label}</div>
        </div>
    );
}
