import { createContext, useState, useEffect, useRef, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { ToastContext } from './toastProvider';
import { CurrentUserContext } from './currentUserProvider';
import { ErrorHandlerContext } from './errorHandlerProvider';
import i18n from '../i18n';
import playerService from '../services/playerService';

export const PreferencesContext = createContext(null);

const DEFAULT_LANGUAGE = "en-US";
const DEFAULT_THEME = "dark";

const getCurrentLanguage = () => localStorage.getItem("i18nextLng") || DEFAULT_LANGUAGE;

const getCurrentTheme = () => {
    const theme = localStorage.getItem("theme") ||
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light");
    document.documentElement.setAttribute("theme", theme);
    return theme;
};

export const PreferencesProvider = ({ children }) => {
    const { t } = useTranslation();
    const { currentUser } = useContext(CurrentUserContext);
    const { handleError } = useContext(ErrorHandlerContext);
    const { showInfoToast } = useContext(ToastContext);

    const [language, setLanguageState] = useState(getCurrentLanguage());
    const [theme, setThemeState] = useState(getCurrentTheme());
    const prevLanguage = useRef(language);
    const prevTheme = useRef(theme);

    const syncPreferences = (newLanguage, newTheme) => {
        if (currentUser) {
            playerService.setPreferencesByPlayerId(currentUser, { language: newLanguage, theme: newTheme })
                .then(dbPreferences => {
                    // showSuccessToast("Preferences updated successfully.");
                    localStorage.setItem("i18nextLng", newLanguage);
                    localStorage.setItem("theme", newTheme);
                    document.documentElement.setAttribute("theme", dbPreferences.theme);
                })
                .catch((error) => {
                    handleError(error);
                });
        } else {
            localStorage.setItem("i18nextLng", newLanguage);
            localStorage.setItem("theme", newTheme);
        }
    };

    useEffect(() => {
        if (currentUser) {
            playerService
                .getPreferencesByPlayerId(currentUser)
                .then((dbPreferences) => {
                    if (dbPreferences) {
                        setLanguageState(dbPreferences.language || DEFAULT_LANGUAGE);
                        setThemeState(dbPreferences.theme || DEFAULT_THEME);
                        localStorage.setItem("i18nextLng", dbPreferences.language || DEFAULT_LANGUAGE);
                        localStorage.setItem("theme", dbPreferences.theme || DEFAULT_THEME);
                        document.documentElement.setAttribute("theme", dbPreferences.theme);
                        // showInfoToast("Preferences loaded successfully.");
                    } else {
                        const localLanguage = getCurrentLanguage();
                        const localTheme = getCurrentTheme();
                        setLanguageState(localLanguage);
                        setThemeState(localTheme);
                        playerService
                            .setPreferencesByPlayerId(currentUser, { language: localLanguage, theme: localTheme })
                            .then(dbPreferences => {
                                localStorage.setItem("i18nextLng", dbPreferences.language || DEFAULT_LANGUAGE);
                                localStorage.setItem("theme", dbPreferences.theme || DEFAULT_THEME);
                                document.documentElement.setAttribute("theme", dbPreferences.theme);
                            })
                            .catch((error) => {
                                handleError(error);
                            });
                    }
                })
                .catch((error) => {
                    if (error?.response?.status === 404) {
                        const localLanguage = getCurrentLanguage();
                        const localTheme = getCurrentTheme();
                        setLanguageState(localLanguage);
                        setThemeState(localTheme);
                        playerService
                            .setPreferencesByPlayerId(currentUser, { language: localLanguage, theme: localTheme })
                            .then(dbPreferences => {
                                localStorage.setItem("i18nextLng", dbPreferences.language || DEFAULT_LANGUAGE);
                                localStorage.setItem("theme", dbPreferences.theme || DEFAULT_THEME);
                                document.documentElement.setAttribute("theme", dbPreferences.theme);                            })
                            .catch((error) => {
                                handleError(error);
                            });
                    } else {
                        handleError(error);
                    }
                });
        }
    }, [currentUser]);

    const setLanguage = (newLanguage) => {
        if (newLanguage !== language) {
            i18n.changeLanguage(newLanguage);
            setLanguageState(newLanguage);
            prevLanguage.current = newLanguage;
            showInfoToast(`${t('language-changed')} ${t(newLanguage)}`);
            syncPreferences(newLanguage, theme);
        }
    };

    const setTheme = (newTheme) => {
        if (newTheme !== theme) {
            document.documentElement.setAttribute("theme", newTheme);
            setThemeState(newTheme);
            prevTheme.current = newTheme;
            showInfoToast(`${t('theme-changed')} ${t(newTheme)}`);
            syncPreferences(language, newTheme);
        }
    };

    return (
        <PreferencesContext.Provider value={{ language, setLanguage, theme, setTheme }}>
            {children}
        </PreferencesContext.Provider>
    );
};
