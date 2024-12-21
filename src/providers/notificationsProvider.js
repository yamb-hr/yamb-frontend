import { createContext, useState, useEffect, useRef, useContext } from 'react';
import { CurrentUserContext } from './currentUserProvider';
import { ErrorHandlerContext } from './errorHandlerProvider';
import { StompClientContext } from './stompClientProvider';
import notificationService from '../services/notificationService';
import playerService from '../services/playerService';
import NotificationModal from '../components/notifications/notifications-modal';

export const NotificationsContext = createContext(null);

export const NotificationsProvider = ({ children }) => {

    const { currentUser } = useContext(CurrentUserContext);
    const { handleError } = useContext(ErrorHandlerContext);
    const { stompClient, isConnected } = useContext(StompClientContext);

    const [notifications, setNotifications] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);

    const toggleModal = () => {
        setModalOpen(!isModalOpen);
    };

    const closeModal = () => {
        setModalOpen(false);
    }

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
    }, [currentUser, stompClient, isConnected]);

    const onNewNotification = (message) => {
        console.log(message);
		let body = JSON.parse(message.body);
        setNotifications([...notifications, body]);
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
        <NotificationsContext.Provider value={{ notifications, deleteNotification, deleteAllNotifications, toggleModal }}>
            {children}
            {isModalOpen && (
                <NotificationModal
                notifications={notifications}
                onClose={closeModal}
                />
            )}
        </NotificationsContext.Provider>
    );
};
