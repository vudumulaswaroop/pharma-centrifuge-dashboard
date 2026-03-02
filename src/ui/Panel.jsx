export function Panel({ title, icon, meta, children, action }) {
    return (
        <div className="panel">
            <div className="panel-head">
                <span className="panel-title">{icon && <span>{icon}</span>}{title}</span>
                {meta && <span className="panel-meta">{meta}</span>}
                {action}
            </div>
            <div className="panel-body">{children}</div>
        </div>
    );
}
