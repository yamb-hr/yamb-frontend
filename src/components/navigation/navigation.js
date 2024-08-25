import { useContext, useEffect } from 'react';
import { CurrentUserContext, DeviceContext, LanguageContext, MenuContext, ThemeContext } from '../../App';
import { useTranslation } from 'react-i18next';
import { AuthService } from '../../services/authService';
import './navigation.css';

function Navigation() {

    const { t } = useTranslation();
    const { isMobile, setMobile } = useContext(DeviceContext);
    const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
    const { isMenuOpen, setMenuOpen } = useContext(MenuContext);
    const { language, toggleLanguage} = useContext(LanguageContext);
    const { theme, toggleTheme } = useContext(ThemeContext);

    const themeButton = <button className="theme-button" onClick={toggleTheme}>
        <img src={`../svg/buttons/${theme === "dark" ? "sun" : "moon"}.svg`} alt={theme} />
    </button>;

    const languageButton = <button className="language-button" onClick={toggleLanguage}>
        <img src="../svg/buttons/language.svg" alt={language} />
    </button>;

    return (
        <nav className={`navbar ${isMobile && isMenuOpen ? 'active' : ''}`}>
            <ul>
                <li><a href="/">{t('play')}</a></li>
                <li><a href="/players">{t('players')}</a></li>
                <li><a href="/scores">{t('scores')}</a></li>
                <li><a href="/games">{t('games')}</a></li>
                {currentUser && <li><a href="/logout" onClick={() => { AuthService.logout(); }}>{t('sign-out')}</a></li>}
                {!currentUser && <li><a href="/register">{t('register')}</a></li>}
                <li>{languageButton}</li>
                <li>{themeButton}</li>
                {currentUser?.roles?.find(x => x.name === "ADMIN") && <li><a href="/admin">Admin</a></li>}
            </ul>
            <div className="shadow" onClick={() => {setMenuOpen(false)}}></div>
            <button className="settings-button" onClick={() => {setMenuOpen(!isMenuOpen)}}>
                <img src="../svg/buttons/cog.svg" alt="Settings" />
            </button>
        </nav>
    );

}

export default Navigation;
