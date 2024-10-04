import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { PreferencesContext } from '../../providers/preferencesProvider';
import './settings.css';

function Settings() {

    const { t } = useTranslation();
    const { theme, setTheme } = useContext(PreferencesContext);
    const { language, setLanguage } = useContext(PreferencesContext);

    function handleThemeChange(event) {
        setTheme(event.target.value);
    }

    function handleLanguageChange(event) {
        setLanguage(event.target.value);
    }

    return (
        <div className="settings-container">
            <div className="settings">
                <form >
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
        </div>
    )
}

export default Settings;