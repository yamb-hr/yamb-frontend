import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { NotificationsContext } from '../../providers/notificationsProvider';
import './notifications.css';

const NotificationsModal = () => {

	const navigate = useNavigate();
	const { notifications, isNotificationsModalOpen, setNotificationsModalOpen, onMarkAsRead, onMarkAllAsRead } = useContext(NotificationsContext);

	const closeModal = () => {
		setNotificationsModalOpen(false);
	}

	const handleClick = (notification) => {
		onMarkAsRead(notification);
		navigate(notification.link);
		setNotificationsModalOpen(false);
	}

	if (isNotificationsModalOpen) return (
		<div className="modal-overlay" onClick={closeModal}>
		<div className="modal-content" onClick={(e) => e.stopPropagation()}>
			<button className="modal-close-button" onClick={closeModal}>
				&times;
			</button>
			{notifications?.length === 0 ? (
				<p>No notifications available.</p>
			) : (
				<>
					<button
						className="mark-all-read-button"
						onClick={onMarkAllAsRead}
					>
					Mark All as Read
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
		</div>
	);
};

export default NotificationsModal;
