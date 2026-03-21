import '../css/Toast.css';

function Toast({ message, type, visible }) {
    return (
        <div className={`toast-container ${visible ? 'show' : ''} ${type}`}>
            <span className="toast-icon">
                {type === 'success' ? '✅' : 'ℹ️'}
            </span>
            <span className="toast-message">{message}</span>
        </div>
    );
}

export default Toast;
