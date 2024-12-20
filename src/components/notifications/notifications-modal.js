import React from 'react';
import './notifications.css';

const NotificationModal = ({ notifications, onClose }) => {
	return (
		<div className="modal-overlay" onClick={onClose}>
			<div className="modal-content" onClick={(e) => e.stopPropagation()}>
				<button className="modal-close-button" onClick={onClose}>
					&times;
				</button>
				<h4>Notifications</h4>
				{notifications.length === 0 ? (
				<p>No notifications available.</p>
				) : (
					<ul className="notification-list">
						{notifications.map((notification, index) => (
						<li key={index} className="notification-item">
							{notification.message || JSON.stringify(notification)}
						</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
};

export default NotificationModal;
