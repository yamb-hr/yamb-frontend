import { createContext, useState, useEffect, useRef, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { ToastContext } from './toastProvider';
import i18n from '../i18n';

export const PreferencesContext = createContext(null);

const getCurrentLanguage = () => {
    let language = "en-US";
    if (localStorage.getItem("i18nextLng")) {
        language = localStorage.getItem("i18nextLng");
    } else {
        language = navigator.language || navigator.userLanguage;
    }
    return language;
};

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

export const PreferencesProvider = ({ children }) => {
    const { t } = useTranslation();
    const { showInfoToast } = useContext(ToastContext);

    const [language, setLanguageState] = useState(getCurrentLanguage());
    const prevLanguage = useRef(language);

    const setLanguage = (newLanguage) => {
        if (newLanguage !== language) {
            i18n.changeLanguage(newLanguage);
            setLanguageState(newLanguage);
            showInfoToast(t('language-changed') + newLanguage);
        }
    };

    useEffect(() => {
        if (prevLanguage.current !== language) {
            prevLanguage.current = language;
        }
    }, [language]);

    const [theme, setThemeState] = useState(getCurrentTheme());
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
        <PreferencesContext.Provider value={{ language, setLanguage, theme, setTheme }}>
            {children}
        </PreferencesContext.Provider>
    );
};
