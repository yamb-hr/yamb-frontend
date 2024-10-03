import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { PreferencesContext } from '../../providers/preferencesProvider';
import { DeviceContext } from '../../providers/deviceProvider';
import { CurrentUserContext } from '../../providers/currentUserProvider';
import { MenuContext } from '../../providers/menuProvider';
import { ToastContext } from '../../providers/toastProvider';
import { toast } from 'react-toastify';
import authService from '../../services/authService';
import './navigation.css';

function Navigation() {
    const navigate = useNavigate();    
    const location = useLocation();
    const { t } = useTranslation();
    const [ activePage, setActivePage ] = useState(location.pathname.substring(1));
    const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
    const { language, setLanguage, theme, setTheme } = useContext(PreferencesContext);
    const { isMenuOpen, setMenuOpen } = useContext(MenuContext);
    const { showInfoToast } = useContext(ToastContext);
    const { isMobile } = useContext(DeviceContext);

    useEffect(() => {
        setActivePage(location.pathname.substring(1));
    }, [location.pathname]);

    useEffect(() => {
        const recaptchaBadge = document.querySelector('.grecaptcha-badge');
        if (isMobile && (activePage !== 'login' && activePage !== 'register')) {
            if (recaptchaBadge) {
                recaptchaBadge.style.visibility = 'hidden';
            }
        } else {
            if (recaptchaBadge) {
                recaptchaBadge.style.visibility = 'visible';
            }
        }
        return () => {
            if (recaptchaBadge) {
                recaptchaBadge.style.visibility = 'visible';
            }
        };        
    }, [isMobile]);

    function handleShare() {
        if (navigator.share) {
            navigator.share({
                title: t('yamb'),
                text: t('share-text'),
                url: `/`
            }).then(() => {
                console.log('Shared successfully!');
            }).catch((error) => {
                console.error('Error sharing:', error);
            });
        } else {
            alert("Your browser doesn't support the Web Share API.");
        }
    }

    function handleThemeChange() {
        const newTheme = theme === "dark" ? "light" : "dark";
        setTheme(newTheme);
    }

    function handleLanguageChange() {
        const newLanguage = language === "en-US" ? "hr" : "en-US";
        setLanguage(newLanguage);
    }

    function handleLogout() {
        showInfoToast(<div>
            {t('confirm-logout')}
            <div className="logout-prompt">
                <button className="logout-prompt-button button-yes" onClick={() => logout()}>{t('yes')}</button>
                <button className="logout-prompt-button button-no" onClick={() => toast.dismiss()}>{t('no')}</button>
            </div>
        </div>);
    }

    function logout() {
        authService.logout();
        setCurrentUser(null);
        navigate("/login");
    }

    const themeButton = (
        <button className="theme-button" onClick={handleThemeChange}>
            {theme === "light" ? <span className="icon">&#127771;</span> : <span className="icon">&#127774;</span>}
        </button>
    );

    const languageButton = (
        <button className="language-button" onClick={handleLanguageChange}>
            <span className="icon">&#127760;</span>
        </button>
    );

    return (
        <div>
            {!isMobile && (
                <div className="top-bar">
                    <ul>
                        <li>
                            <input type="text" className="search" placeholder="&#128269; Search.." />
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
                            <input type="text" className="search" placeholder="&#128269; Search.." />
                        </li>
                    )}
                    <li>
                        <Link to="/" className={activePage === '' ? 'active' : ''} onClick={() => setMenuOpen(false)}>
                            <span className="icon">&#9889;</span>
                            {isMenuOpen ? <span>&nbsp;{t('play')}</span> : <span className="menu-label">&nbsp;{t('play')}</span>}
                        </Link>
                    </li>
                    <li>
                        <Link to="/clashes" className={activePage === 'clashes' ? 'active' : ''} onClick={() => setMenuOpen(false)}>
                        &nbsp;<span className="icon">&#9876;</span>
                            {isMenuOpen ? <span>&nbsp;&nbsp;{t('clashes')}</span> : <span className="menu-label">&nbsp;&nbsp;{t('clashes')}</span>}
                        </Link>
                    </li>
                    <li>
                        <Link to="/rankings" className={activePage === 'rankings' ? 'active' : ''} onClick={() => setMenuOpen(false)}>
                            <span className="icon">&#127942;</span>
                            {isMenuOpen ? <span>&nbsp;{t('rankings')}</span> : <span className="menu-label">&nbsp;{t('rankings')}</span>}
                        </Link>
                    </li>
                    <hr style={{ width: '90%' }} />
                    <li>
                        <Link to="/profile" className={activePage === 'profile' ? 'active' : ''} onClick={() => setMenuOpen(false)}>
                            <span className="icon">&#128100;</span>
                            {isMenuOpen ? <span>&nbsp;&nbsp;{t('profile')}</span> : <span className="menu-label">&nbsp;&nbsp;{t('profile')}</span>}
                        </Link>
                    </li>
                    <li>
                        <Link to="/about" className={activePage === 'about' ? 'active' : ''} onClick={() => setMenuOpen(false)}>
                            <span className="icon">&#128220;</span>
                            {isMenuOpen ? <span>&nbsp;&nbsp;{t('about')}</span> : <span className="menu-label">&nbsp;&nbsp;{t('about')}</span>}
                        </Link>
                    </li>
                    <li>
                        <Link to="/settings" className={activePage === 'settings' ? 'active' : ''} onClick={() => setMenuOpen(false)}>
                            &nbsp;<span className="icon">&#9881;</span>
                            {isMenuOpen ? <span>&nbsp;&nbsp;&nbsp;{t('settings')}</span> : <span className="menu-label">&nbsp;&nbsp;&nbsp;{t('settings')}</span>}
                        </Link>
                    </li>
                    <hr style={{ width: '90%' }} />
                    <li>
                        <Link to="/admin" className={activePage === 'admin' ? 'active' : ''} onClick={() => setMenuOpen(false)}>
                        &nbsp;<span className="icon">&#128736;</span>
                            {isMenuOpen ? <span>&nbsp;&nbsp;&nbsp;{t('admin')}</span> : <span className="menu-label">&nbsp;&nbsp;&nbsp;{t('admin')}</span>}
                        </Link>
                    </li>
                    <li>
                    <Link onClick={handleShare}>
                        <span className="icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="19">
                                <circle cx="18" cy="5" r="3" fill="currentColor"/>
                                <circle cx="18" cy="19" r="3" fill="currentColor"/>
                                <circle cx="6" cy="12" r="3" fill="currentColor"/>
                                <line x1="18" y1="5" x2="6" y2="12" stroke="currentColor" strokeWidth="2"/>
                                <line x1="18" y1="19" x2="6" y2="12" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                        </span>
                        {isMenuOpen ? <span>&nbsp;&nbsp;&nbsp;{t('share')}</span> : <span className="menu-label">&nbsp;&nbsp;&nbsp;{t('share')}</span>}
                    </Link>
                    </li>
                    {currentUser ? (
                        <li>
                            <Link onClick={handleLogout}>
                                <span>&#128275;</span>
                                {isMenuOpen ? <span>&nbsp;&nbsp;{t('sign-out')}</span> : <span className="menu-label">&nbsp;{t('sign-out')}</span>}
                            </Link>
                        </li>
                    ) : (
                        <li>
                            <Link to="/register" className={activePage === 'register' ? 'active' : ''} onClick={() => setMenuOpen(false)}>
                                <span>&#128271;</span>
                                {isMenuOpen ? <span>&nbsp;&nbsp;{t('sign-up')}</span> : <span className="menu-label">&nbsp;{t('sign-up')}</span>}
                            </Link>
                        </li>
                    )}
                    {isMobile && isMenuOpen && <div className="language-theme-buttons">
                        <li>{languageButton} {themeButton}</li>
                    </div>}
                </ul>
                {isMobile && isMenuOpen && <div className="navbar-shadow" onClick={() => setMenuOpen(false)}></div>}
                {isMobile && !isMenuOpen && (location?.pathname !== '/' && !location?.pathname?.startsWith('/games/')) && (
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
