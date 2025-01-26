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
        <div>
            {notifications?.length === 0 ? (
                <p>{t("no-notifications-available")}</p>
            ) : (
                <>
                    <button className="mark-all-read-button" onClick={onMarkAllAsRead}>
                    {t("mark-all-as-read")}
                    </button>
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
