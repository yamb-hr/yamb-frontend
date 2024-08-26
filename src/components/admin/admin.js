import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CurrentUserContext } from '../../App';
import './admin.css';

function Admin() {

    const navigate = useNavigate();   
    const { currentUser } = useContext(CurrentUserContext);

    useEffect(() => {
        if (!currentUser?.roles?.find(x => x.name === 'ADMIN')) {
            navigate('/');
        }
    });
    
    return (
        <div className="admin">
            <a href="/chat">Chat</a>
        </div>
    );
};

export default Admin;
