import { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContext } from './toastProvider';
import { StompClientContext } from './stompClientProvider';
import { ErrorHandlerContext } from './errorHandlerProvider';
import { AuthenticationContext } from './authenticationProvider';
import playerService from '../services/playerService';
import notificationService from '../services/notificationService';

export const NotificationsContext = createContext(null);

export const NotificationsProvider = ({ children }) => {

    const navigate = useNavigate();

    const { showInfoToast } = useContext(ToastContext);
    const { handleError } = useContext(ErrorHandlerContext);
    const { currentUser } = useContext(AuthenticationContext);
    const { stompClient, isConnected } = useContext(StompClientContext);

    const [notifications, setNotifications] = useState([]);
    const [isNotificationsModalOpen, setNotificationsModalOpen] = useState(false);

    useEffect(() => {
        if (currentUser && stompClient && isConnected) {
            console.log(`Subscribing to /player/${currentUser.id}/private`);
            const subscription = stompClient.subscribe(`/player/${currentUser.id}/private`, (message) => {
                const body = JSON.parse(message.body);
                console.log(body);
                const newNotification = body.payload;
                setNotifications(prevNotifications => [
                    ...prevNotifications,
                    newNotification
                ]);
        
                showInfoToast(
                    <div
                        style={{ cursor: 'pointer' }}
                        onClick={() => navigate(newNotification.link)}
                    >
                        {newNotification.content}
                    </div>
                );
            });

            playerService.getNotificationsByPlayerId(currentUser)
                .then(data => {
                    if (data?._embedded?.notifications) {
                        setNotifications(data?._embedded?.notifications);
                    }
                }).catch(error => handleError(error));
    
            return () => subscription.unsubscribe();
        }
    }, [currentUser, stompClient, isConnected, handleError, showInfoToast]);

    
    
	function onMarkAsRead(notification) {
		deleteNotification(notification);
        setNotifications(prevNotifications => prevNotifications.filter(n => n.id !== notification.id));
	}

	function onMarkAllAsRead() {
		deleteAllNotifications();
        setNotifications([]);
	}

	function deleteNotification(notification) {
        notificationService.deleteById(notification).then(() => {
        }).catch(error => {
            handleError(error);
        });
    }

    function deleteAllNotifications() {
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
