import {useState} from "react";
import {MachineDetail} from "./MachineDetail";
import {MachineCard} from "./MachineCard";

export function Machines({ metrics, user }) {
    const [selected, setSelected]   = useState(null);
    const [filter,   setFilter]     = useState("all");
    const [plantF,   setPlantF]     = useState("all");
    const [search,   setSearch]     = useState("");

    const visible = metrics.filter(m => {
        const roleOk  = user.role === "plant" ? m.plant === user.plant : true;
        const statOk  = filter === "all" || m.status === filter;
        const plantOk = plantF === "all" || m.plant === plantF;
        const srchOk  = !search || m.name.toLowerCase().includes(search.toLowerCase()) ||
            m.id.toLowerCase().includes(search.toLowerCase()) ||
            m.product.toLowerCase().includes(search.toLowerCase());
        return roleOk && statOk && plantOk && srchOk;
    });

    if (selected) {
        const m = metrics.find(x => x.id === selected);
        return <MachineDetail m={m} onBack={() => setSelected(null)}/>;
    }

    const counts = { all: metrics.length, running: metrics.filter(m=>m.status==="running").length, idle: metrics.filter(m=>m.status==="idle").length, warning: metrics.filter(m=>m.status==="warning").length };

    return (
        <>
            <div className="breadcrumb">
                <span>CentroMon</span><span className="bc-sep">/</span><span>Centrifuge Machines</span>
            </div>

            {/* Filters */}
            <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
                <input className="form-input" style={{ width: 220 }} placeholder="Search machines, batches, products…"
                       value={search} onChange={e => setSearch(e.target.value)}/>

                <div style={{ display: "flex", gap: 4, background: "var(--surf)", border: "1px solid var(--border)", borderRadius: 9, padding: 3 }}>
                    {["all","running","idle","warning"].map(s => (
                        <button key={s} className={`tab ${filter === s ? "active" : ""}`}
                                style={{ padding: "5px 14px", fontSize: 12 }} onClick={() => setFilter(s)}>
                            {s.toUpperCase()} ({counts[s]})
                        </button>
                    ))}
                </div>

                {user.role !== "plant" && (
                    <div style={{ display: "flex", gap: 4, background: "var(--surf)", border: "1px solid var(--border)", borderRadius: 9, padding: 3 }}>
                        {["all","Plant A","Plant B","Plant C"].map(p => (
                            <button key={p} className={`tab ${plantF === p ? "active" : ""}`}
                                    style={{ padding: "5px 14px", fontSize: 12 }} onClick={() => setPlantF(p)}>
                                {p === "all" ? "ALL" : p}
                            </button>
                        ))}
                    </div>
                )}

                <span style={{ marginLeft: "auto", fontSize: 12, color: "var(--text2)", fontFamily: "var(--mono)" }}>
          {visible.length} machine{visible.length !== 1 ? "s" : ""}
        </span>
            </div>

            <div className="machine-grid">
                {visible.map(m => (
                    <MachineCard key={m.id} m={m} onClick={setSelected}/>
                ))}
            </div>
        </>
    );
}
