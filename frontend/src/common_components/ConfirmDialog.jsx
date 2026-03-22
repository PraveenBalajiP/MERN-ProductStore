import '../css/confirmDialog.css';

function ConfirmDialog({
    open,
    title,
    message,
    confirmText='Confirm',
    cancelText='Cancel',
    onConfirm,
    onCancel,
    danger=false,
    children
}){
    if(!open) return null;

    return(
        <div className="confirm-overlay" role="dialog" aria-modal="true" aria-label={title || 'Confirmation dialog'}>
            <div className="confirm-dialog">
                <h3>{title}</h3>
                {message ? <p>{message}</p> : null}
                {children}
                <div className="confirm-actions">
                    <button type="button" className="confirm-cancel" onClick={onCancel}>{cancelText}</button>
                    <button
                        type="button"
                        className={danger ? 'confirm-accept confirm-danger' : 'confirm-accept'}
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmDialog;
