import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { LanguageContext } from '../../providers/languageProvider';
import { ThemeContext } from '../../providers/themeProvider';
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
    const { language, setLanguage } = useContext(LanguageContext);
    const { isMenuOpen, setMenuOpen } = useContext(MenuContext);
    const { theme, setTheme } = useContext(ThemeContext);
    const { showInfoToast } = useContext(ToastContext);
    const { isMobile } = useContext(DeviceContext);

    function handleNavigate(page) {
        setActivePage(page);
        navigate(`/${page}`);
        setMenuOpen(false);
    }

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
        setTheme(newTheme)
    }

    function handleLanguageChange() {
		const newLanguage = language === "en-US" ? "hr" : "en-US";
        setLanguage(newLanguage)
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
                        <a className={activePage === '' ? 'active' : ''} onClick={() => handleNavigate('')}>
                            <span className="icon">&#9889;</span>
                            {isMenuOpen ? <span>&nbsp;{t('play')}</span> : <span className="menu-label">&nbsp;{t('play')}</span>}
                        </a>
                    </li>
                    <li>
                        <a className={activePage === 'clashes' ? 'active' : ''} onClick={() => handleNavigate("clashes")}>
                        &nbsp;<span className="icon">&#9876;</span>
                            {isMenuOpen ? <span>&nbsp;&nbsp;{t('clashes')}</span> : <span className="menu-label">&nbsp;&nbsp;{t('clashes')}</span>}
                        </a>
                    </li>
                    <li>
                        <a className={activePage === 'rankings' ? 'active' : ''} onClick={() => handleNavigate("rankings")}>
                            <span className="icon">&#127942;</span>
                            {isMenuOpen ? <span>&nbsp;{t('rankings')}</span> : <span className="menu-label">&nbsp;{t('rankings')}</span>}
                        </a>
                    </li>
                    <hr style={{ width: '90%' }} />
                    <li>
                    <a className={activePage === 'profile' ? 'active' : ''} onClick={() => handleNavigate("profile")}>
                            <span className="icon">&#128100;</span>
                            {isMenuOpen ? <span>&nbsp;&nbsp;{t('profile')}</span> : <span className="menu-label">&nbsp;&nbsp;{t('profile')}</span>}
                        </a>
                    </li>
                    <li>
                        <a className={activePage === 'about' ? 'active' : ''} onClick={() => handleNavigate("about")}>
                            <span className="icon">&#128220;</span>
                            {isMenuOpen ? <span>&nbsp;&nbsp;{t('about')}</span> : <span className="menu-label">&nbsp;&nbsp;{t('about')}</span>}
                        </a>
                    </li>
                    <li>
                    <a className={activePage === 'settings' ? 'active' : ''} onClick={() => handleNavigate("settings")}>
                            &nbsp;<span className="icon">&#9881;</span>
                            {isMenuOpen ? <span>&nbsp;&nbsp;&nbsp;{t('settings')}</span> : <span className="menu-label">&nbsp;&nbsp;{t('settings')}</span>}
                        </a>
                    </li>
                    <hr style={{ width: '90%' }} />
                    <li>
                        <a className={activePage === 'admin' ? 'active' : ''} onClick={() => handleNavigate("admin")}>
                            <span className="icon">&#128736;</span>
                            {isMenuOpen ? <span>&nbsp;&nbsp;&nbsp;{t('admin')}</span> : <span className="menu-label">&nbsp;&nbsp;{t('admin')}</span>}
                        </a>
                    </li>
                    <li>
                        <a className={activePage === 'share' ? 'active' : ''} onClick={() => handleShare()}>
                            <span className="icon">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="19">
                                    <circle cx="18" cy="5" r="3" fill="currentColor"/>
                                    <circle cx="18" cy="19" r="3" fill="currentColor"/>
                                    <circle cx="6" cy="12" r="3" fill="currentColor"/>
                                    <line x1="18" y1="5" x2="6" y2="12" stroke="currentColor" strokeWidth="2"/>
                                    <line x1="18" y1="19" x2="6" y2="12" stroke="currentColor" strokeWidth="2"/>
                                </svg>
                            </span>
                            
                            {isMenuOpen ? <span>&nbsp;&nbsp;&nbsp;{t('share')}</span> : <span className="menu-label">&nbsp;&nbsp;{t('share')}</span>}
                        </a>
                    </li>
                    {currentUser && currentUser?.registered ? (
                        <li>
                            <a className="logout" onClick={() => handleLogout()}>
                                <span>&#128275;</span>
                                {isMenuOpen ? <span>&nbsp;&nbsp;{t('sign-out')}</span> : <span className="menu-label">&nbsp;{t('sign-out')}</span>}
                            </a>
                        </li>
                    ) : (
                        <li>
                            <a className={activePage === 'register' ? 'active' : ''} onClick={() => handleNavigate("register")}>
                                <span>&#128271;</span>
                                {isMenuOpen ? <span>&nbsp;&nbsp;{t('sign-up')}</span> : <span className="menu-label">&nbsp;{t('sign-up')}</span>}
                            </a>
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
