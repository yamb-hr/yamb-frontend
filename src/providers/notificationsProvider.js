import { createContext, useState, useEffect, useRef, useContext } from 'react';
import { CurrentUserContext } from './currentUserProvider';
import { ErrorHandlerContext } from './errorHandlerProvider';
import { StompClientContext } from './stompClientProvider';
import notificationService from '../services/notificationService';
import playerService from '../services/playerService';

export const NotificationsContext = createContext(null);

export const NotificationsProvider = ({ children }) => {

    const { currentUser } = useContext(CurrentUserContext);
    const { handleError } = useContext(ErrorHandlerContext);
    const { stompClient, isConnected } = useContext(StompClientContext);

    const [notifications, setNotifications] = useState([]);

    // useEffect(() => {
    //     if (currentUser && stompClient && isConnected) {
    //         const subscription = stompClient.subscribe(`/topic/players/${currentUser.id}`, onNewNotification);
    //         playerService.getNotificationsByPlayerId(currentUser).then(data => {
    //             setNotifications(data);
    //         }).catch(error => {
    //             handleError(error);
    //         });
    //         return () => {
    //             subscription.unsubscribe();
    //         };
    //     }
    // }, [currentUser, stompClient, isConnected]);

    const onNewNotification = (message) => {
		let body = JSON.parse(message.body);
        setNotifications([...notifications, body.content]);
	}

    const deleteNotification = (notificationId) => {
        notificationService.deleteById(notificationId).then(() => {
        }).catch(error => {
            handleError(error);
        });
    }

    const deleteAllNotifications = () => {
        playerService.deleteNotificationsByPlayerId().then(() => {
            
        }).catch(error => {
            handleError(error);
        });
    }

    return (
        <NotificationsContext.Provider value={{ notifications, deleteNotification, deleteAllNotifications }}>
            {children}
        </NotificationsContext.Provider>
    );
};
