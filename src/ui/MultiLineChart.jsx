export function MultiLineChart({ datasets = [], height = 140 }) {
    if (!datasets.length || !datasets[0].data.length) return null;
    const W   = 600, H = height;
    const all = datasets.flatMap(d => d.data);
    const min = Math.min(...all), max = Math.max(...all), range = max - min || 1;
    const pts = (data) => data.map((v, i) => {
        const x = (i / (data.length - 1)) * W;
        const y = H - ((v - min) / range) * (H - 10) - 5;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
    });
    return (
        <svg viewBox={`0 0 ${W} ${H}`} className="chart-svg" preserveAspectRatio="none" style={{ height }}>
            {datasets.map((ds, i) => (
                <polyline key={i} points={pts(ds.data).join(" ")} fill="none"
                          stroke={ds.color} strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" opacity="0.9"/>
            ))}
        </svg>
    );
}
