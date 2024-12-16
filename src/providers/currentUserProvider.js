import { createContext, useState, useEffect } from 'react';
import playerService from '../services/playerService';
import authService from '../services/authService';
import { ErrorHandlerContext } from './errorHandlerProvider';
import Spinner from '../components/spinner/spinner';

export const CurrentUserContext = createContext(null);

export const CurrentUserProvider = ({ children }) => {
    
    const [ currentUser, setCurrentUser ] = useState(null);

    useEffect(() => {
        playerService.getCurrentPlayer()
            .then(player => setCurrentUser(player))
            .catch(error => {
                if (error?.response?.status === 400 || error?.response?.status === 401) {
                    authService.logout();
                    setCurrentUser(null);
                }
            });
    }, []);

    if (loading) {
        return <Spinner />
    }

    return (
        <CurrentUserContext.Provider value={{ currentUser, setCurrentUser }}>
            {children}
        </CurrentUserContext.Provider>
    );
};
