export function Sparkline({ data = [], color = "#00d4ff", height = 60, fill = true }) {
    if (!data.length) return null;
    const W = 600, H = height;
    const min = Math.min(...data), max = Math.max(...data), range = max - min || 1;
    const pts = data.map((v, i) => {
        const x = (i / (data.length - 1)) * W;
        const y = H - ((v - min) / range) * (H - 8) - 4;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
    });
    const area = `M ${pts[0]} L ${pts.join(" L ")} L ${W},${H} L 0,${H} Z`;
    const gid  = `sg-${color.replace(/[^a-z0-9]/gi, "")}`;
    return (
        <svg viewBox={`0 0 ${W} ${H}`} className="chart-svg" preserveAspectRatio="none" style={{ height }}>
            <defs>
                <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor={color} stopOpacity="0.25"/>
                    <stop offset="100%" stopColor={color} stopOpacity="0.02"/>
                </linearGradient>
            </defs>
            {fill && <path d={area} fill={`url(#${gid})`}/>}
            <polyline points={pts.join(" ")} fill="none" stroke={color} strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round"/>
        </svg>
    );
}
