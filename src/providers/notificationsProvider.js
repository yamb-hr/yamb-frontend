import { createContext, useState, useEffect, useRef, useContext } from 'react';
import { CurrentUserContext } from './currentUserProvider';
import { ErrorHandlerContext } from './errorHandlerProvider';
import playerService from '../services/playerService';
import notificationService from '../services/playerService';
import { StompClientContext } from './stompClientProvider';

export const NotificationsContext = createContext(null);

export const NotificationsProvider = ({ children }) => {

    const { currentUser } = useContext(CurrentUserContext);
    const { handleError } = useContext(ErrorHandlerContext);
    const { stompClient, isConnected } = useContext(StompClientContext);

    const [notifications, setNotifications] = useState([]);
	const [activePlayers, setActivePlayers] = useState([]);

    useEffect(() => {
        if (currentUser && stompClient && isConnected) {
            stompClient.subscribe('/topic/players', onPlayerStatusChanged);
            playerService.getAllActive().then(data => {
                setActivePlayers(data._embedded.players);
            }).catch(error => {
                handleError(error);
            });
            stompClient.subscribe(`/topic/players/${currentUser.id}`, onNewNotification);
            playerService.getNotificationsByPlayerId.then(data => {
                setNotifications(data);
            }).catch(error => {
                handleError(error);
            });
            return () => subscription.unsubscribe();
        }
    }, [id, stompClient, isConnected, subscribed]);

	const onPlayerStatusChanged = (message) => {
		let body = JSON.parse(message.body);
		setActivePlayers(JSON.parse(atob(body.payload)).content);
	}

    const onNewNotification = (message) => {
		let body = JSON.parse(message.body);
        setNotifications([...notifications, body.content]);
		setActivePlayers(JSON.parse(atob(body.payload)).content);
	}

    const deleteNotification = (notificationId) => {
        notificationService.deleteById(notificationId).then(() => {
            
        }).catch(error => {
            handleError(error);
        });
    }

    const deleteAllNotifications = () => {
        playerService.deleteNotificationsByPlayerId(notificationId).then(() => {
            
        }).catch(error => {
            handleError(error);
        });
    }

    return (
        <PreferencesContext.Provider value={{ notifications, deleteNotification, deleteAllNotifications, activePlayers }}>
            {children}
        </PreferencesContext.Provider>
    );
};
