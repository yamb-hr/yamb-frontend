import { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ErrorHandlerContext } from './errorHandlerProvider';
import playerService from '../services/playerService';
import authService from '../services/authService';
import Spinner from '../components/spinner/spinner';

export const AuthenticationContext = createContext(null);

const RECAPTCHA_SITE_KEY = process.env.REACT_APP_RECAPTCHA_SITE_KEY;
const LOCAL_STORAGE_TOKEN_KEY = "token";

export const AuthenticationProvider = ({ children }) => {

	const navigate = useNavigate();

	const { handleError } = useContext(ErrorHandlerContext);

	const [currentUser, setCurrentUser] = useState(null);

	const colors = ["Red", "Blue", "Green", "Yellow", "Purple", "Orange", "Pink", "Cyan", "Teal", "White"];
	const animals = ["Panda", "Tiger", "Dolphin", "Fox", "Owl", "Wolf", "Eagle", "Bear", "Shark", "Rabbit"];

	useEffect(() => {
		if (localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY)) {
			// migrate token storage to http only cookie
			authService.migrateToken().then(player => {
				setCurrentUser(player);
				localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
			}).catch(error => {
				if (error?.response?.status === 400 || error?.response?.status === 401) {
					logout();
				} else {
					handleError(error);
				} 
			});
		} else {
			playerService.getCurrentPlayer().then(player => {
				setCurrentUser(player);
			}).catch(error => {
				if (error?.response?.status === 400 || error?.response?.status === 401) {
					logout();
				} else {
					handleError(error);
				} 
			});
		}
	}, [handleError]);

	function logout() {
		authService.logout().then(() => {
			setCurrentUser(null);
			registerGuest();
		}).catch(error => {
			handleError(error);
		}).finally(() => {	
			navigate("/login");
		});
	}

	function registerGuest() {
		retryRecaptcha();
	};

	function retryRecaptcha(retries = 3, delay = 1000) {
		if (retries === 0) {
			console.error('Failed to load reCAPTCHA after multiple attempts');
			return;
		}
		if (window.grecaptcha) {
			window.grecaptcha.ready(() => {
				window.grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: 'register' })
				.then(recaptchaToken => {
					registerGuestWithRecaptcha(recaptchaToken);
				})
				.catch(error => {
					console.error('reCAPTCHA execution error:', error);
				});
			});
		} else {
			setTimeout(() => retryRecaptcha(retries - 1, delay), delay);
		}
	};

	function registerGuestWithRecaptcha(recaptchaToken) {
		authService.registerGuest({ username: generateUsername() }, recaptchaToken).then(player => {
			setCurrentUser(player);
		}).catch(error => {
			handleError(error);
		});
	};

	function generateUsername() {
		const randomColor = colors[Math.floor(Math.random() * colors.length)];
		const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
		const randomNumber = Math.floor(Math.random() * 1000);
		return `${randomColor}${randomAnimal}${randomNumber}`;
	}

	if (!currentUser) {
		return <Spinner/>
	}

	return (
		<AuthenticationContext.Provider value={{ currentUser, setCurrentUser, registerGuest, logout }}>
			{children}
		</AuthenticationContext.Provider>
	);
	
};
