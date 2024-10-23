import { createContext, useState, useEffect } from 'react';
import playerService from '../services/playerService';
import authService from '../services/authService';

export const CurrentUserContext = createContext(null);

export const CurrentUserProvider = ({ children }) => {
    
    const [ currentUser, setCurrentUser ] = useState(null);
    const [ loading, setLoading ] = useState(true);

    useEffect(() => {
        setLoading(true);
        playerService.getCurrentPlayer()
            .then(player => setCurrentUser(player))
            .catch(error => {
                if (error?.response?.status === 400 || error?.response?.status === 401) {
                    authService.logout();
                    setCurrentUser(null);
                }
            }).finally(() => {
                setLoading(false);
            })
    }, []);

    return (
        <CurrentUserContext.Provider value={{ currentUser, setCurrentUser, loading }}>
            {children}
        </CurrentUserContext.Provider>
    );
};
