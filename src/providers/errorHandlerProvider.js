import { createContext, useContext } from 'react';
import { ToastContext } from './toastProvider';

export const ErrorHandlerContext = createContext(null);

export const ErrorHandlerProvider = ({ children }) => {
    
    const { showErrorToast } = useContext(ToastContext);

    const handleError = (error) => {
        console.error(error);
        const message = error?.response?.data?.message || error.message;
        if (message) {
            showErrorToast(message);
        }
    };

    return (
        <ErrorHandlerContext.Provider value={{ handleError }}>
            {children}
        </ErrorHandlerContext.Provider>
    );
    
};
