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
import AuthService from './api/auth-service';
import PlayerService from "./api/player-service";
import { slide as Menu } from 'react-burger-menu'
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import Element from './components/table/element';

export const ThemeContext = createContext(null);
export const LanguageContext = createContext(null);
export const CurrentUserContext = createContext(null);
export const MenuContext = createContext(null);
export const ErrorContext = createContext(null);

var socket = null

function App() {
	
	const { t } = useTranslation();
	const [ theme, setTheme ] = useState(getCurrentTheme());
	const [ language, setLanguage ] = useState(getCurrentLanguage());
	const [ currentUser, setCurrentUser ] = useState(AuthService.getCurrentPlayer());
	const [ isMenuOpen, setMenuOpen ] = useState(false);

    const [ principal, setPrincipal ] = useState(null);
    const [ connected, setConnected ] = useState(false);
	
    const [ topics, setTopics ] = useState(["/chat/public"]);

	useEffect(() => {
        if (principal) {
            let newTopics = ["/chat/public"];
            setTopics([...newTopics, "/player/" + principal + "/private"]);
        }
    }, [principal]);

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
		toast.error(error, {
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

	function handleOnMenuClose() {
		setMenuOpen(false);
	}

	return (
		<div className="App">
			<button className="settings-button" onClick={() => {setMenuOpen(!isMenuOpen)}}>
                <img src="../svg/buttons/cog.svg" alt="Settings" ></img>
            </button>
			<Menu isOpen={ isMenuOpen } onClose={handleOnMenuClose} className={ "menu" } customBurgerIcon={ false }>
				<br/>
				<a href="/">{t('play')}</a>
				<br/>
				<a href="/players">{t('players')}</a>
				<br/>
				<a href="/scores">{t('scores')}</a>
				<br/>
				<a href="/games">{t('games')}</a>
				<br/>
				{currentUser?.tempUser ? <a href="/register">{t('register')}</a> : <a href="/logout">{t('logout')}</a>}
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
			</Menu>
			<header className="App-header">
				<ErrorContext.Provider value={{ handleError}}>
					<MenuContext.Provider value={{ isMenuOpen, setMenuOpen}}>
						<CurrentUserContext.Provider value={{ currentUser, setCurrentUser}}>
							<ThemeContext.Provider value={{ theme, toggleTheme}}>
								<LanguageContext.Provider value={{ language, toggleLanguage}}>
										<Router>
											<Routes>
												<Route path="/" element={<Home  />} />
												<Route path="/login" element={<Login  />} />
												<Route path="/register" element={<Register  />} />
												<Route path="/players" element={<Players  />} />
												<Route path="/players/:id" element={<Element />} />
												<Route path="/scores" element={<Scores  />} />
												<Route path="/scores/:id" element={<Element />} />
												<Route path="/games" element={<Games  />} />
												<Route path="/games/:id" element={<Yamb  />} />
												<Route path="/admin" element={<Admin  />} />
												<Route path="/chat" element={<Chat  />} />
												<Route path="/dashboard" element={<Dashboard  />} />
											</Routes>
										</Router>
								</LanguageContext.Provider>
							</ThemeContext.Provider>
						</CurrentUserContext.Provider>
					</MenuContext.Provider>
				</ErrorContext.Provider>
				<ToastContainer limit={5} style={{fontSize:"medium"}}/>
				{currentUser && <SockJsClient url={process.env.REACT_APP_API_URL + "/ws?token=" + currentUser.token}
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
			</header>
		</div>
	);
}

export default App;
