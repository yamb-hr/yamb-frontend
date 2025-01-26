import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { NotificationsContext } from '../../providers/notificationsProvider';
import './notification.css';

const NotificationsModal = () => {

    const navigate = useNavigate();	
    const { t } = useTranslation();

    const { notifications, setNotificationsModalOpen, onMarkAsRead, onMarkAllAsRead } = useContext(NotificationsContext);

    const handleClick = (notification) => {
        onMarkAsRead(notification);
        navigate(notification.link);
        setNotificationsModalOpen(false);
    }

    return (
        <div className="notification-list-container">
            {notifications?.length === 0 ? (
                <p>{t("no-notifications-available")}</p>
            ) : (
                <>
                    <div className="button-container">
                        <button className="mark-all-as-read-button" onClick={onMarkAllAsRead}>
                            {t("mark-all-as-read")}
                        </button>
                    </div>
                    <ul className="notification-list">
                        {notifications.map((notification, index) => (
                            <li key={index} className="notification-item">
                                <div className="notification-content" >
                                    <span onClick={() => handleClick(notification)}>{notification.content}</span>
                                    <button className="mark-as-read-button" onClick={(e) => {e.preventDefault();onMarkAsRead(notification)}}>&#9993;</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
};

export default NotificationsModal;
