import { createContext } from 'react';
import { Slide, toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {

    const getCurrentTheme = () => {
        return document.documentElement.getAttribute("theme") || "light"; // Get the theme dynamically from the document
    };

    const showSuccessToast = (message) => {
        toast.success(message, {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            pauseOnFocusLoss: true,
            draggable: true,
            progress: undefined,
            theme: getCurrentTheme(),
            transition: Slide
        });
    };

    const showErrorToast = (message) => {
        toast.error(message, {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            pauseOnFocusLoss: true,
            draggable: true,
            progress: undefined,
            theme: getCurrentTheme(),
            transition: Slide
        });
    };

    const showInfoToast = (message, autoClose) => {
        toast.info(message, {
            position: "top-center",
            autoClose: autoClose || 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            pauseOnFocusLoss: true,
            draggable: true,
            progress: undefined,
            theme: getCurrentTheme(),
            transition: Slide
        });
    };

    return (
        <ToastContext.Provider value={{ showSuccessToast, showErrorToast, showInfoToast }}>
            {children}
            <ToastContainer limit={5} style={{ fontSize: "var(--font-size-tab)" }}/>
        </ToastContext.Provider>
    );
    
};
