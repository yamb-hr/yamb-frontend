import { createContext, useContext } from 'react';
import { ToastContext } from './toastProvider';

export const ErrorContext = createContext(null);

export const ErrorProvider = ({ children }) => {

    const { showErrorToast } = useContext(ToastContext);


    const handleError = (error) => {
        console.error(error);
        let message = error?.response?.data?.message ? error.response.data.message : error.message;
        if (message) {
            showErrorToast(message);
        }
    };

    return (
        <ErrorContext.Provider value={{ handleError }}>
            {children}
        </ErrorContext.Provider>
    );
};