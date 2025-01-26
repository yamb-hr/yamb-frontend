import { createContext, useState, useEffect, useContext } from 'react';
import { ErrorHandlerContext } from './errorHandlerProvider';
import playerService from '../services/playerService';
import authService from '../services/authService';
import Spinner from '../components/spinner/spinner';

export const CurrentUserContext = createContext(null);

const RECAPTCHA_SITE_KEY = process.env.REACT_APP_RECAPTCHA_SITE_KEY;

export const CurrentUserProvider = ({ children }) => {

    const { handleError } = useContext(ErrorHandlerContext);

    const [ currentUser, setCurrentUser ] = useState(null);
    const [ loading, setLoading ] = useState(true);

    const colors = ["Red", "Blue", "Green", "Yellow", "Purple", "Orange", "Pink", "Cyan", "Teal", "White"];
    const animals = ["Panda", "Tiger", "Dolphin", "Fox", "Owl", "Wolf", "Eagle", "Bear", "Shark", "Rabbit"];
    
    function generateUsername() {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
        const randomNumber = Math.floor(Math.random() * 1000);
        return `${randomColor}${randomAnimal}${randomNumber}`;
    }

    useEffect(() => {
        setLoading(true);
        if (authService.getAccessToken()) {
            playerService.getCurrentPlayer().then(player => {
                setCurrentUser(player)
            }).catch(error => {
                if (error?.response?.status === 400 || error?.response?.status === 401) {
                    authService.logout();
                    setCurrentUser(null);
                    registerGuest();
                } else {
                    handleError(error);
                }
            }).finally(() => {
                setLoading(false);
            });
        } else {
            registerGuest();
        }
    }, []);

    const retryRecaptcha = (retries = 3, delay = 1000) => {
        if (retries === 0) {
            console.error('Failed to load reCAPTCHA after multiple attempts');
            return;
        }
    
        if (window.grecaptcha) {
            window.grecaptcha.ready(() => {
                window.grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: 'register' })
                    .then(recaptchaToken => {
                        authService.registerGuest({ username: generateUsername() }, recaptchaToken).then(data => {
                            localStorage.setItem('token', data.token);
                            setCurrentUser(data.player);
                            setLoading(false);
                        }).catch(error => {
                            handleError(error);
                        });
                    }).catch(error => {
                        console.error('reCAPTCHA execution error:', error);
                    });
            });
        } else {
            setTimeout(() => retryRecaptcha(retries - 1, delay), delay);
        }
    };
    
    const registerGuest = () => {
        setLoading(true);
        retryRecaptcha();
    };
    

    if (loading) {
        return <Spinner />
    }

    return (
        <CurrentUserContext.Provider value={{ currentUser, setCurrentUser, registerGuest}}>
            {children}
        </CurrentUserContext.Provider>
    );
};
