import React, { useState } from 'react';
import './collapsible.css';

const Collapsible = ({ title, children }) => {
    
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="collapsible-section">
            <div className="collapsible-header" onClick={toggleOpen}>
                <h3>{title}</h3>
                <span>{isOpen ? '▲' : '▼'}</span>
            </div>
            {isOpen && (
                <div className="collapsible-content">
                    {children}
                </div>
            )}
        </div>
    );
};

export default Collapsible;
