import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './settings.css';
import { ThemeContext } from '../../providers/themeProvider';
import { LanguageContext } from '../../providers/languageProvider';

function Settings() {

    const { t } = useTranslation();
    const { theme, setTheme } = useContext(ThemeContext);
    const { language, setLanguage } = useContext(LanguageContext);

    function handleThemeChange(event) {
        setTheme(event.target.value);
    }

    function handleLanguageChange(event) {
        setLanguage(event.target.value);
    }

    return (
        <div className="settings">
            <form>
                <div>
                    <label className="input-label">{t('theme')}:</label>
                    <select name="theme" id="theme" onChange={handleThemeChange} value={theme}>
                        <option value="light">{t('light')}</option>
                        <option value="dark">{t('dark')}</option>
                    </select>
                </div>
                <div>
                    <label className="input-label">{t('language')}:</label>
                    <select name="language" id="language" onChange={handleLanguageChange} value={language}>
                        <option value="en">{t('english')}</option>
                        <option value="hr">{t('croatian')}</option>
                    </select>
                </div>                
            </form>
        </div>
    )
}

export default Settings;