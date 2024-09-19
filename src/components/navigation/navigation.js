import { useContext } from 'react';
import { CurrentUserContext, DeviceContext, LanguageContext, MenuContext, ThemeContext } from '../../App';
import { useTranslation } from 'react-i18next';
import authService from '../../services/authService';
import './navigation.css';

function Navigation() {
    const { t } = useTranslation();
    const { isMobile } = useContext(DeviceContext);
    const { currentUser } = useContext(CurrentUserContext);
    const { isMenuOpen, setMenuOpen } = useContext(MenuContext);
    const { language, toggleLanguage } = useContext(LanguageContext);
    const { theme, toggleTheme } = useContext(ThemeContext);

    const themeButton = (
        <button className="theme-button" onClick={toggleTheme}>
            {theme === "light" ? <span className="icon">&#127771;</span> : <span className="icon">&#127774;</span>}
        </button>
    );

    const languageButton = (
        <button className="language-button" onClick={toggleLanguage}>
            <span className="icon">&#127760;</span>
        </button>
    );

    return (
        <div>
            {!isMobile && (
                <div className="top-bar">
                    <ul>
                        <li>
                            <input type="text" className="search" placeholder="Search.." />
                        </li>
                        <li>{languageButton}</li>
                        <li>{themeButton}</li>
                    </ul>
                </div>
            )}
            <nav className={`navbar ${isMenuOpen ? 'active' : 'collapsed'}`}>
                <ul>
                    <div className="app-title">
                        <img src="/logo.png" alt="Yamb" />
                        <span className={`app-name ${!isMenuOpen ? 'collapsed' : ''}`}>{t('yamb')}</span>
                    </div>
                    {isMobile && (
                        <li>
                            <input type="text" className="search" style={{ filter: 'grayscale(100%)' }} placeholder="&#128269; Search.." />
                        </li>
                    )}
                    <li>
                        <a href="/">
                            <span className="icon">&#9889;</span>
                            {isMenuOpen ? <span>&nbsp;{t('play')}</span> : <span className="menu-label">&nbsp;{t('play')}</span>}
                        </a>
                    </li>
                    <li>
                        <a href="/clash">
                        &nbsp;<span className="icon">&#9876;</span>
                            {isMenuOpen ? <span>&nbsp;&nbsp;{t('clash')}</span> : <span className="menu-label">&nbsp;&nbsp;{t('clash')}</span>}
                        </a>
                    </li>
                    <li>
                        <a href="/rankings">
                            <span className="icon">&#127942;</span>
                            {isMenuOpen ? <span>&nbsp;{t('rankings')}</span> : <span className="menu-label">&nbsp;{t('rankings')}</span>}
                        </a>
                    </li>
                    <li>
                        <a href="/settings">
                            &nbsp;<span className="icon">&#9881;</span>
                            {isMenuOpen ? <span>&nbsp;&nbsp;{t('settings')}</span> : <span className="menu-label">&nbsp;&nbsp;{t('settings')}</span>}
                        </a>
                    </li>
                    <hr style={{ width: '90%' }} />
                    <li>
                        <a href="/info">
                            <span className="icon">&#128220;</span>
                            {isMenuOpen ? <span>&nbsp;&nbsp;Info</span> : <span className="menu-label">&nbsp;&nbsp;Info</span>}
                        </a>
                    </li>
                    <li>
                        <a href="/code">
                            &nbsp;<span className="icon">&#10094;&#10095;</span>
                            {isMenuOpen ? <span>&nbsp;&nbsp;{t('code')}</span> : <span className="menu-label">&nbsp;{t('code')}</span>}
                        </a>
                    </li>
                    <li>
                        <a href="/matej">
                            <span className="icon">&#9977;</span>
                            {isMenuOpen ? <span>&nbsp;Matej</span> : <span className="menu-label">&nbsp;Matej</span>}
                        </a>
                    </li>
                    <li>
                        <a href="/status">
                            <span className="icon">&#128340;</span>
                            {isMenuOpen ? <span>&nbsp;Status</span> : <span className="menu-label">&nbsp;Status</span>}
                        </a>
                    </li>
                    <hr style={{ width: '90%' }} />
                    {currentUser && currentUser?.registered ? (
                        <li>
                            <a className="logout" href="/logout" onClick={() => authService.logout()}>
                                <span className="icon">&#128275;</span>
                                {isMenuOpen ? <span>&nbsp;{t('sign-out')}</span> : <span className="menu-label">&nbsp;{t('sign-out')}</span>}
                            </a>
                        </li>
                    ) : (
                        <li>
                            <a href="/register">
                                <span className="icon">&#128271;</span>
                                {isMenuOpen ? <span>&nbsp;{t('sign-up')}</span> : <span className="menu-label">&nbsp;{t('sign-up')}</span>}
                            </a>
                        </li>
                    )}
                </ul>
                {isMobile && isMenuOpen && <div className="navbar-shadow" onClick={() => setMenuOpen(false)}></div>}
                {isMobile && !isMenuOpen && (
                    <button className="burger" onClick={() => setMenuOpen(!isMenuOpen)}>
                        <span className="icon">&#9776;</span>
                    </button>
                )}
                {!isMobile && (
                    <button className="menu-toggle" onClick={() => setMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <span className="icon">&#171;</span> : <span className="icon">&#187;</span>}
                    </button>
                )}
            </nav>
        </div>
    );
}

export default Navigation;
