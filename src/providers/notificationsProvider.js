import { createContext, useState, useEffect, useContext } from 'react';
import { ErrorHandlerContext } from './errorHandlerProvider';
import { CurrentUserContext } from './currentUserProvider';
import { StompClientContext } from './stompClientProvider';
import { ToastContext } from './toastProvider';
import notificationService from '../services/notificationService';
import playerService from '../services/playerService';

export const NotificationsContext = createContext(null);

export const NotificationsProvider = ({ children }) => {

    const { stompClient, isConnected } = useContext(StompClientContext);
    const { handleError } = useContext(ErrorHandlerContext);
    const { currentUser } = useContext(CurrentUserContext);
    const { showInfoToast } = useContext(ToastContext);

    const [notifications, setNotifications] = useState([]);
    const [isNotificationsModalOpen, setNotificationsModalOpen] = useState(false);

    useEffect(() => {
        if (currentUser && stompClient && isConnected) {
            console.log(`Subscribing to /player/${currentUser.id}/private`);
            const subscription = stompClient.subscribe(`/player/${currentUser.id}/private`, onNewNotification);

            playerService.getNotificationsByPlayerId(currentUser)
                .then(data => {
                    if (data?._embedded?.notifications) {
                        setNotifications(data?._embedded?.notifications);
                    }
                }).catch(error => handleError(error));
    
            return () => subscription.unsubscribe();
        }
    }, [currentUser, stompClient, isConnected, handleError]);

    const onNewNotification = (message) => {
		const body = JSON.parse(message.body);
        const newNotification = body.payload;
        setNotifications(prevNotifications => [
            ...prevNotifications,
            newNotification
        ]);

        showInfoToast(
            <div
                style={{ cursor: 'pointer' }}
                onClick={() => window.location.href = newNotification.link}
            >
                {newNotification.content}
            </div>
        );
	}
    
	const onMarkAsRead = (notification) => {
		deleteNotification(notification);
        setNotifications(prevNotifications => prevNotifications.filter(n => n.id !== notification.id));
	}

	const onMarkAllAsRead = () => {
		deleteAllNotifications();
        setNotifications([]);
	}

	const deleteNotification = (notification) => {
        notificationService.deleteById(notification).then(() => {
        }).catch(error => {
            handleError(error);
        });
    }

    const deleteAllNotifications = () => {
        playerService.deleteNotificationsByPlayerId(currentUser).then(() => {
        }).catch(error => {
            handleError(error);
        });
    }

    return (
        <NotificationsContext.Provider value={{ notifications, isNotificationsModalOpen, setNotificationsModalOpen, onMarkAsRead, onMarkAllAsRead }}>
            {children}
        </NotificationsContext.Provider>
    );
};
