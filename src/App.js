import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer, toast, Slide } from 'react-toastify';
import { createContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SockJsClient from "react-stomp";
import i18n from './i18n';
import Home from './components/home/home';
import Login from './components/auth/login';
import Register from './components/auth/register';
import Players from './components/table/players';
import Scores from './components/table/scores';
import Games from './components/table/games';
import Admin from './components/admin/admin';
import Yamb from './components/yamb/yamb';
import Chat from './components/chat/chat';
import Dashboard from './components/dashboard/dashboard';
import { AuthService } from './services/authService';
import { PlayerService } from "./services/playerService";
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import Logout from './components/auth/logout';
import Navigation from './components/navigation/navigation';
import Player from './components/table/player';
import Score from './components/table/score';
import Logs from './components/table/logs';
import Log from './components/table/log';

export const ThemeContext = createContext(null);
export const LanguageContext = createContext(null);
export const CurrentUserContext = createContext(null);
export const MenuContext = createContext(null);
export const ErrorContext = createContext(null);
export const DeviceContext = createContext(null);

var socket = null

function App() {
	
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
        };

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
				theme: theme
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
        i18n.changeLanguage(language);
    }

	function handleError(error) {
		if (error.message) {
			toast.error(error.message, {
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
										{currentUser && <SockJsClient url={process.env.REACT_APP_API_URL + "/ws?token=" + AuthService.getAccessToken()}
											topics={topics}
											onMessage={(message) => {
												handleMessage(message);
											}}
											onConnect={() => {
												handleConnected();
											}}
											onDisconnect={() => {
												handleDisconnected();
											}}
											ref={(client) => {
												socket = client;
										}} />}
										<Router>
											<Routes>
												<Route path="/" element={<Home  />} />
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
												<Route path="/dashboard" element={<Dashboard  />} />
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
