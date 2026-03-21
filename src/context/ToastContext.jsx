import { createContext, useState, useContext, useCallback } from 'react';
import Toast from '../components/Toast';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
    const [toast, setToast] = useState({ message: '', type: '', visible: false });

    const showToast = useCallback((message, type = 'success') => {
        setToast({ message, type, visible: true });
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            setToast(prev => ({ ...prev, visible: false }));
        }, 3000);
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <Toast message={toast.message} type={toast.type} visible={toast.visible} />
        </ToastContext.Provider>
    );
};
