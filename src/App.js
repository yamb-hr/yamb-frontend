import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer, toast, Slide } from 'react-toastify';
import { createContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SockJsClient from "react-stomp";
import i18n from './i18n';
import Home from './components/home/home';
import Login from './components/auth/login';
import Register from './components/auth/register';

import Admin from './components/admin/admin';
import Yamb from './components/yamb/yamb';
import Chat from './components/chat/chat';
import { AuthService } from './services/authService';
import { PlayerService } from "./services/playerService";
import Logout from './components/auth/logout';
import Navigation from './components/navigation/navigation';
import Players from './components/dynamic/table/players';
import Scores from './components/dynamic/table/scores';
import Games from './components/dynamic/table/games';
import Logs from './components/dynamic/table/logs';
import Player from './components/dynamic/element/player';
import Score from './components/dynamic/element/score';
import Log from './components/dynamic/element/log';
import Play from './components/play/play';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

export const ThemeContext = createContext(null);
export const LanguageContext = createContext(null);
export const CurrentUserContext = createContext(null);
export const MenuContext = createContext(null);
export const ErrorContext = createContext(null);
export const DeviceContext = createContext(null);

var socket = null

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
	const [ theme, setTheme ] = useState(getCurrentTheme());
	const [ language, setLanguage ] = useState(getCurrentLanguage());
	const [ currentUser, setCurrentUser ] = useState(AuthService.getCurrentPlayer());
	const [ isMenuOpen, setMenuOpen ] = useState(false);
	const [ isMobile, setMobile ] = useState(window.innerWidth <= 480);

    const [ principal, setPrincipal ] = useState(null);
    const [ connected, setConnected ] = useState(false);
	
    const [ topics, setTopics ] = useState(["/chat/public"]);

	useEffect(() => {
        if (principal) {
            let newTopics = ["/chat/public"];
            setTopics([...newTopics, "/player/" + principal + "/private"]);
        }
    }, [principal]);

    useEffect(() => {
        const handleResize = () => {
			setMobile(window.innerWidth <= 480);
		}
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

	function toggleTheme() {
		let newTheme = theme === "dark" ? "light" : "dark";
		setTheme(newTheme);
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
		localStorage.setItem("nextTheme", newTheme === "dark" ? "light" : "dark");
	}

	function getCurrentTheme() {
		let theme = "dark";
		if (localStorage.getItem("nextTheme")) {
			if (localStorage.getItem("nextTheme") === "dark") {
				theme = "light";
			} else {
				theme = "dark";
			}
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
        if (localStorage.getItem("i18nextLng")) {
            if (localStorage.getItem("i18nextLng") === "en-US") {
                return "hr";
            } else {
                return "en-US";
            }
        } else {
            return navigator.language || navigator.userLanguage;
        }
    }

	function toggleLanguage() {
        if (language === "en-US") {
            setLanguage("hr");
        } else {
            setLanguage("en-US");
        }
        i18n.changeLanguage(language);
        toast.info(t('language-changed') + language, {
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

	function handleConnected() {
        setConnected(true);
		if (currentUser) {
			PlayerService.getPrincipalById(
				currentUser.id
			)
			.then(data => {
				setPrincipal(data.principal);
			}
			).catch(error => {
				handleError(error);
			});
		}
    }

	function handleMessage(message) {
		console.log(message);
	}

	function handleDisconnected() {
		setPrincipal(null);
		console.log("Disconnected");
	}

	function sendMessage(message, channel) {
		if (socket) {
			socket.sendMessage("/app" + channel, JSON.stringify(message));
		}
	}

	const sockJsClient = useMemo(() => {
		const token = AuthService.getAccessToken();
	
		if (!token) {
			return null;
		}
	
		return (
			<SockJsClient 
				url={process.env.REACT_APP_API_URL + "/ws?token=" + token}
				topics={topics}
				onMessage={handleMessage}
				onConnect={handleConnected}
				onDisconnect={handleDisconnected}
				ref={(client) => { socket = client; }}
			/>
		);
	}, [topics]);

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
										{/* {currentUser && sockJsClient} */}
										<Router>
											<Routes>
												<Route path="/" element={<Play />} />
												<Route path="/scoreboard" element={<Home  />} />
												<Route path="/login" element={<Login  />} />
												<Route path="/register" element={<Register  />} />
												<Route path="/players" element={<Players  />} />
												<Route path="/players/:id" element={<Player />} />
												<Route path="/scores" element={<Scores  />} />
												<Route path="/scores/:id" element={<Score />} />
												<Route path="/games" element={<Games  />} />
												<Route path="/games/:id" element={<Yamb  />} />
												<Route path="/logs" element={<Logs />} />
												<Route path="/log/:id" element={<Log />} />
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
