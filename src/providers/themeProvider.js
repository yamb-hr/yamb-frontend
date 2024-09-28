import { createContext, useState, useEffect, useRef, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { ToastContext } from './toastProvider';

export const ThemeContext = createContext(null);

const getCurrentTheme = () => {
    let theme = "dark";
    if (localStorage.getItem("theme")) {
        theme = localStorage.getItem("theme");
    } else {
        theme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light";
    }
    document.documentElement.setAttribute("theme", theme);
    return theme;
};

export const ThemeProvider = ({ children }) => {

    const { t } = useTranslation();
    const { showInfoToast } = useContext(ToastContext);
    const [ theme, setThemeState ] = useState(getCurrentTheme());
    const prevTheme = useRef(theme);

    const setTheme = (newTheme) => {
        if (newTheme !== theme) {
            document.documentElement.setAttribute("theme", newTheme);
            localStorage.setItem("theme", newTheme);
            setThemeState(newTheme);
            showInfoToast(t('theme-changed') + newTheme);
        }
    };

    useEffect(() => {
        if (prevTheme.current !== theme) {
            prevTheme.current = theme;
        }
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
    
};
