import {useEffect} from 'react';
import {createPortal} from 'react-dom';
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
    useEffect(()=>{
        if(!open) return;
        const previousOverflow=document.body.style.overflow;
        document.body.style.overflow='hidden';
        return()=>{
            document.body.style.overflow=previousOverflow;
        };
    },[open]);

    if(!open) return null;

    const dialogMarkup=(
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

    return createPortal(dialogMarkup,document.body);
}

export default ConfirmDialog;
