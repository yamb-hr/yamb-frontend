import { createContext, useState, useEffect, useRef, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { ToastContext } from './toastProvider';
import i18n from '../i18n';

export const LanguageContext = createContext(null);

const getCurrentLanguage = () => {
    let language = "en-US";
    if (localStorage.getItem("i18nextLng")) {
        language = localStorage.getItem("i18nextLng");
    } else {
        language = navigator.language || navigator.userLanguage;
    }
    return language;
};

export const LanguageProvider = ({ children }) => {

    const { t } = useTranslation();
    const { showInfoToast } = useContext(ToastContext);
    const [ language, setLanguageState ] = useState(getCurrentLanguage());
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

    return (
        <LanguageContext.Provider value={{ language, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};
