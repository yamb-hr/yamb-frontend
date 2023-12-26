import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CurrentUserContext } from '../../App';
import './admin.css';

function Admin() {

    const navigate = useNavigate();   
    const { currentUser } = useContext(CurrentUserContext);

    useEffect(() => {
        if (!currentUser?.roles?.find(x => x.label === 'ADMIN')) {
            navigate('/');
        }
    });
    
    return (
        <div className="admin">
            <div className="form">
                Admin
                <br/>
                <br/>
                <a href="/">Home</a>
                <br/>
                <a href="/chat">Chat</a>
                <br/>
                <a href="/dashboard">Dashboard</a>
                <br/>
                <a href="/players">Players</a>
                <br/>
                <a href="/games">Games</a>
                <br/>
                <a href="/scores">Scores</a>
            </div>
        </div>
    );
};

export default Admin;
