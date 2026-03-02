import {Panel} from "../ui/Panel";
import {MACHINES} from "../constants";

export function MachinesTab() {
    return (
        <Panel title="Machine Registry" icon="⚙ "
               action={<button className="btn-primary" style={{ fontSize:12, padding:"6px 14px" }}>+ Register Machine</button>}>
            <table className="tbl">
                <thead>
                <tr><th>ID</th><th>Name</th><th>Model</th><th>Plant</th><th>Capacity</th><th>Commissioned</th><th>Serial No.</th><th>Actions</th></tr>
                </thead>
                <tbody>
                {MACHINES.map(m => (
                    <tr key={m.id}>
                        <td style={{ fontFamily:"var(--mono)", color:"var(--acc)", fontSize:12 }}>{m.id}</td>
                        <td style={{ fontWeight:700, fontSize:13 }}>{m.name}</td>
                        <td style={{ fontSize:11, color:"var(--text2)", fontFamily:"var(--mono)" }}>{m.model}</td>
                        <td style={{ fontSize:12 }}>{m.plant}</td>
                        <td style={{ fontSize:11, color:"var(--text2)", fontFamily:"var(--mono)" }}>{m.capacity}</td>
                        <td style={{ fontSize:11, fontFamily:"var(--mono)", color:"var(--text2)" }}>{m.commissionYear}</td>
                        <td style={{ fontSize:10, fontFamily:"var(--mono)", color:"var(--text3)" }}>{m.serialNo}</td>
                        <td style={{ display:"flex", gap:6 }}>
                            <button className="btn-sm" style={{ fontSize:10 }}>Config</button>
                            <button className="btn-sm" style={{ fontSize:10 }}>History</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </Panel>
    );
}
