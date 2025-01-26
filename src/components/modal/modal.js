import React from 'react';
import './modal.css';

const Modal = ({ children, isOpen, onClose }) => {
    
    if (!isOpen) return null;

    const closeModal = () => {
        if (onClose) onClose();
    };

    return (
        <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-button" onClick={closeModal}>
                    &times;
                </button>
                {children}
            </div>
        </div>
    );
};

export default Modal;
