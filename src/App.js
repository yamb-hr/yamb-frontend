import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer, toast, Slide } from 'react-toastify';
import { createContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from './i18n';
import Login from './components/auth/login';
import Register from './components/auth/register';
import Admin from './components/admin/admin';
import Yamb from './components/yamb/yamb';
import Chat from './components/chat/chat';
import authService from './services/authService';
import Logout from './components/auth/logout';
import Navigation from './components/navigation/navigation';
import Players from './components/dynamic/table/players';
import Scores from './components/dynamic/table/scores';
import Games from './components/dynamic/table/games';
import Player from './components/dynamic/element/player';
import Score from './components/dynamic/element/score';
import Play from './components/play/play';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import playerService from './services/playerService';

export const ThemeContext = createContext(null);
export const LanguageContext = createContext(null);
export const CurrentUserContext = createContext(null);
export const MenuContext = createContext(null);
export const ErrorContext = createContext(null);
export const DeviceContext = createContext(null);

function App() {

	const RECAPTCHA_SITE_KEY = process.env.REACT_APP_RECAPTCHA_SITE_KEY;

    useEffect(() => {
        const script = document.createElement('script');
        script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
        script.async = true;

        script.onerror = () => {
            console.error('Failed to load reCAPTCHA script');
        };

        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };

    }, [RECAPTCHA_SITE_KEY]);
	
	const { t } = useTranslation();
	const [ currentUser, setCurrentUser ] = useState(authService.getCurrentPlayer());
	const [ isMenuOpen, setMenuOpen ] = useState(false);
	const [ isMobile, setMobile ] = useState(window.innerWidth <= 480);
	const [ language, setLanguage ] = useState(getCurrentLanguage());
	const [ theme, setTheme ] = useState(getCurrentTheme());
    const prevLanguage = useRef(language);
    const prevTheme = useRef(theme);

	useEffect(() => {
        if (currentUser) {
			playerService.getPreferencesByPlayerId(currentUser.id).then(response => {
				if (response.data) {
					if (response.data.language) {
						setLanguage(response.data.language);
						i18n.changeLanguage(response.data.language);
						localStorage.setItem("i18nextLng", response.data.language);
					}
					if (response.data.theme) {
						setTheme(response.data.theme);
						document.documentElement.setAttribute("theme", response.data.theme);	
						localStorage.setItem("theme", response.data.language);
					}
				}
			}).catch(error => {
				console.error(error);
				if (error?.response?.data?.status === 404) {
					playerService.setPreferencesByPlayerId(currentUser.id, { language: language, theme: theme }).then(response => {
						console.log(response);
					});
				}
			});
		}
	}, [ currentUser ]);

	useEffect(() => {
        if (currentUser) {
            if (prevLanguage.current !== language || prevTheme.current !== theme) {
                playerService.setPreferencesByPlayerId(currentUser.id, { language: language, theme: theme })
                    .then(response => {
                        prevLanguage.current = language;
                        prevTheme.current = theme;
                    })
                    .catch(error => console.error(error));
            }
        }
    }, [language, theme, currentUser]);

    useEffect(() => {
        const handleResize = () => {
			setMobile(window.innerWidth <= 480);
		}
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

	function getCurrentTheme() {
		let theme = "dark";
		if (localStorage.getItem("theme")) {
			theme = localStorage.getItem("theme");
		} else {
			if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
				theme = "dark";
			} else {
				theme = "light"
			}
		}
		document.documentElement.setAttribute("theme", theme);
		return theme;
	}

	function getCurrentLanguage() {
		let language = "en-US";
		if (localStorage.getItem("i18nextLng")) {
			language = localStorage.getItem("i18nextLng")
		} else {
			language = navigator.language || navigator.userLanguage
		}
		return language
    }

	function toggleLanguage() {
		const newLanguage = language === "en-US" ? "hr" : "en-US";
		if (newLanguage !== language) {
			i18n.changeLanguage(newLanguage);
			setLanguage(newLanguage);
			toast.info(t('language-changed') + newLanguage, {
				position: "top-center",
				autoClose: 1000,
				transition: Slide,
				hideProgressBar: true,
				closeOnClick: true,
				pauseOnHover: false,
				pauseOnFocusLoss: false,
				draggable: true,
				progress: undefined,
				theme: theme
			});
		}
	}

	function toggleTheme() {
		const newTheme = theme === "dark" ? "light" : "dark";
		toast.info(t('theme-changed') + newTheme, {
            position: "top-center",
				autoClose: 1000,
				transition: Slide,
				hideProgressBar: true,
				closeOnClick: true,
				pauseOnHover: false,
				pauseOnFocusLoss: false,
				draggable: true,
				progress: undefined,
				theme: newTheme
        });
		document.documentElement.setAttribute("theme", newTheme);
		localStorage.setItem("theme", newTheme);
		setTheme(newTheme);
	}

	function handleError(error) {
		console.error(error);
		let message = error.response?.data?.message ? error.response.data.message : error.message;
		if (message) {
			toast.error(message, {
				position: "top-center",
				autoClose: 2000,
				transition: Slide,
				hideProgressBar: true,
				closeOnClick: true,
				pauseOnHover: true,
				pauseOnFocusLoss: true,
				draggable: true,
				progress: undefined,
				theme: theme
			});
		}
	}

	return (
		<div className="App">
			<header className="App-header">
				<ErrorContext.Provider value={{ handleError}}>
					<DeviceContext.Provider value={{ isMobile, setMobile}}>
						<MenuContext.Provider value={{ isMenuOpen, setMenuOpen}}>
							<CurrentUserContext.Provider value={{ currentUser, setCurrentUser}}>
								<ThemeContext.Provider value={{ theme, toggleTheme}}>
									<LanguageContext.Provider value={{ language, toggleLanguage}}>
										<Navigation 
											isMenuOpen={isMenuOpen} 
											setMenuOpen={setMenuOpen} 
											currentUser={currentUser} 
											toggleLanguage={toggleLanguage} 
											language={language} 
											toggleTheme={toggleTheme} 
											theme={theme} 
											t={t} 
										/>
										<ToastContainer limit={5} style={{fontSize:"medium"}}/>
										<div id="recaptcha-container"></div>
										<Router>
											<Routes>
												<Route path="/" element={<Play />} />
												<Route path="/login" element={<Login  />} />
												<Route path="/register" element={<Register  />} />
												<Route path="/players" element={<Players  />} />
												<Route path="/players/:id" element={<Player />} />
												<Route path="/scores" element={<Scores  />} />
												<Route path="/scores/:id" element={<Score />} />
												<Route path="/games" element={<Games  />} />
												<Route path="/games/:id" element={<Yamb  />} />
												<Route path="/admin" element={<Admin  />} />
												<Route path="/chat" element={<Chat  />} />
												<Route path="/logout" element={<Logout  />} />
											</Routes>
										</Router>		
									</LanguageContext.Provider>
								</ThemeContext.Provider>
							</CurrentUserContext.Provider>
						</MenuContext.Provider>
					</DeviceContext.Provider>
				</ErrorContext.Provider>
			</header>
		</div>
	);
}

export default App;
