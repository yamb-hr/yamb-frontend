import { createContext, useContext, useEffect, useState } from 'react';
import { ErrorHandlerContext } from './errorHandlerProvider';
import { StompClientContext } from './stompClientProvider';
import { CurrentUserContext } from './currentUserProvider';
import playerService from '../services/playerService';

export const ActivePlayersContext = createContext(null);

export const ActivePlayersProvider = ({ children }) => {

    const { stompClient, isConnected } = useContext(StompClientContext);
    const { currentUser } = useContext(CurrentUserContext);
    const { handleError } = useContext(ErrorHandlerContext);

    const [activePlayers, setActivePlayers] = useState([]);

    useEffect(() => {
        if (currentUser && stompClient && isConnected) {
            const subscription = stompClient.subscribe('/topic/players', onPlayerStatusChanged);
            playerService.getAllActive().then(data => {
                setActivePlayers(data._embedded?.players || []);
            }).catch(error => {
                handleError(error);
            });
            return () => {
                subscription.unsubscribe();
            };
        }
    }, [currentUser, stompClient, isConnected]);

    const onPlayerStatusChanged = (message) => {
		const body = JSON.parse(message.body);
        const updatedActivePlayers = body.payload.content;
		setActivePlayers(updatedActivePlayers);
	}

    return (
        <ActivePlayersContext.Provider value={{ activePlayers }}>
            {children}
        </ActivePlayersContext.Provider>
    );
    
};