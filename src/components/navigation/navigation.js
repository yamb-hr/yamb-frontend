import { useContext } from 'react';
import { slide as Menu } from 'react-burger-menu'
import { CurrentUserContext, DeviceContext, LanguageContext, MenuContext, ThemeContext } from '../../App';
import { useTranslation } from 'react-i18next';
import { AuthService } from '../../services/authService';
import './navigation.css';

function Navigation(props) {

    const { t } = useTranslation();
    const { isMobile, setMobile } = useContext(DeviceContext);
    const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
    const { isMenuOpen, setMenuOpen } = useContext(MenuContext);
    const { language, toggleLanguage} = useContext(LanguageContext);
    const { theme, toggleTheme } = useContext(ThemeContext);


    return (
        <div className="navigation">
            {isMobile ? (
                <button className="settings-button" onClick={() => setMenuOpen(!isMenuOpen)}>
                    <img src="../svg/buttons/cog.svg" alt="Settings" />
                </button>
            ) : (
                <nav>
                    <a href="/">{t('play')}</a>
                    <a href="/players">{t('players')}</a>
                    <a href="/scores">{t('scores')}</a>
                    <a href="/games">{t('games')}</a>
                    {currentUser && <a href="/logout" onClick={() => {
                        AuthService.logout();
                    }}>{t('logout')}</a>}
                    {!currentUser && <a href="/register">{t('register')}</a>}
                    <button className="language-button" onClick={toggleLanguage}>
                        <img src="../svg/buttons/language.svg" alt={language} />
                    </button>
                    <button className="theme-button" onClick={toggleTheme}>
                        <img src={`../svg/buttons/${theme === "dark" ? "sun" : "moon"}.svg`} alt={theme} />
                    </button>
                    {currentUser?.roles?.find(x => x.label === "ADMIN") && <a href="/admin">Admin</a>}
                </nav>
            )}
            {isMobile && <Menu isOpen={ isMenuOpen } onClose={() => {setMenuOpen(false)}} className={ "menu" } customBurgerIcon={ false }>
				<br/>
				<a href="/">{t('play')}</a>
				<br/>
				<a href="/players">{t('players')}</a>
				<br/>
				<a href="/scores">{t('scores')}</a>
				<br/>
				<a href="/games">{t('games')}</a>
				<br/>
                    {currentUser && <a href="/logout" onClick={() => {
                        AuthService.logout();
                    }}>{t('logout')}</a>}
                    {!currentUser && <a href="/register">{t('register')}</a>}
				<br/>
				<div className="menu-buttons"> 
					<button className="language-button" onClick={toggleLanguage}>
						<img src="../svg/buttons/language.svg" alt={language} ></img>
					</button>
					&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
					<button className="theme-button" onClick={toggleTheme}>
						<img src={"../svg/buttons/" + (theme === "dark" ? "sun" : "moon") + ".svg"} alt={theme}></img>
					</button>
				</div>
				<br/>
                {currentUser?.roles?.find(x => x.label=== "ADMIN") && <a href="/admin">Admin</a>}	
			</Menu>}
        </div>
    );
}

export default Navigation;
