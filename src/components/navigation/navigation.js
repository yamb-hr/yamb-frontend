import { useContext, useEffect } from 'react';
import { CurrentUserContext, DeviceContext, LanguageContext, MenuContext, ThemeContext } from '../../App';
import { useTranslation } from 'react-i18next';
import authService from '../../services/authService';
import './navigation.css';

function Navigation() {

    const { t } = useTranslation();
    const { isMobile, setMobile } = useContext(DeviceContext);
    const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
    const { isMenuOpen, setMenuOpen } = useContext(MenuContext);
    const { language, toggleLanguage} = useContext(LanguageContext);
    const { theme, toggleTheme } = useContext(ThemeContext);

    const themeButton = <button className="theme-button" onClick={toggleTheme}>
        {theme === "light" ? <span className="icon">&#127771;</span> : <span className="icon">&#127774;</span>}
    </button>

    const languageButton = <button className="language-button" onClick={toggleLanguage}>
        <span className="icon">&#127760;</span>
    </button>

    return (
        <div>
            {!isMobile && <div className="top-bar">
                <ul>
                    <li><input type="text" className="search" placeholder="Search.."></input></li>
                    <li>{languageButton}</li>
                    <li>{themeButton}</li>
                </ul>
            </div>}
            <nav className={`navbar ${isMobile && isMenuOpen ? 'active' : ''}`}>
                <ul>
                    <div className="app-title">
                        <img src="/logo.png" alt="Yamb" /><span className="app-name">{t('yamb')}</span>
                    </div>
                    {isMobile && <li><input type="text" className="search" style={{filter: "grayscale(100%)"}} placeholder="&#128269; Search.."></input></li>}
                    {/* <span className="menu-label">Pages</span> */}
                    {/* <li><a href="/"><span className="icon">&#127968;&nbsp;</span>{t('home')}</a></li> */}
                    <li><a href="/"><span className="icon">&#9889;</span>&nbsp;{t('play')}</a></li>
                    <li><a href="/scores"><span className="icon">&#127942;</span>&nbsp;{t('rankings')}</a></li>
                    <li><a href="/players"><span className="icon">&#128101;</span>&nbsp;{t('players')}</a></li>
                    <li><a href="/settings">&nbsp;<span className="icon">&#9881;</span>&nbsp;&nbsp;{t('settings')}</a></li>
                    <hr style={{width: "90%"}} />
                    <li><a href="/info"><span className="icon">&#128220;</span>&nbsp;Info</a></li>
                    <li><a href="https://github.com/MatejDanic/yamb">&nbsp;<span className="icon">&#10094;&#10095;</span>&nbsp;{t('code')}</a></li>
                    <li><a href="https://matej-danic.from.hr"><span className="icon">&#9977;</span>&nbsp;Matej</a></li>
                    <li><a href="https://status.jamb.com.hr"><span className="icon">&#128340;</span>&nbsp;Status</a></li>

                    {/* <span className="menu-label">Authentication</span> */}
                    <hr style={{width: "90%"}} />
                    {currentUser && currentUser?.registered && <li><a className="logout" href="/logout" onClick={() => { authService.logout(); }}><span className="icon">&#128275;&nbsp;</span>{t('sign-out')}</a></li>}
                    {/* {(!currentUser || !currentUser?.registered) && <li><a href="/login"><span className="icon">&#128274;&nbsp;</span>{t('sign-in')}</a></li>} */}
                    {(!currentUser || !currentUser?.registered) && <li><a href="/register"><span className="icon">&#10133;</span>&nbsp;{t('sign-up')}</a></li>}

                    <div className="icon-buttons">
                        {languageButton}
                        {themeButton}
                    </div>
                </ul>
                <div className="navbar-shadow" onClick={() => {setMenuOpen(false)}}></div>
                <button className="burger" onClick={() => {setMenuOpen(!isMenuOpen)}}>
                    <span className="icon">&#9776;</span>
                </button>
            </nav>
        </div>
        
    );

}

export default Navigation;
