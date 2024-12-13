import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CurrentUserContext } from '../../providers/currentUserProvider';
import './admin.css';

function Admin() {

    const navigate = useNavigate();   
    const { currentUser } = useContext(CurrentUserContext);

    useEffect(() => {
        if (currentUser && !currentUser?.admin) {
            navigate("/")
        }
    }, [currentUser]);
    
    return (
        <div className="admin-container">
            <div className="admin">
                <ul>
                    <li><Link to="/logs">Logs</Link></li>
                    <li><Link to="/games">Games</Link></li>
                    <li><Link to="/players">Players</Link></li>
                    <li><Link to="/scores">Scores</Link></li>
                    <li><Link to="/clashes">Clashes</Link></li>
                    <li><Link to="/tickets">Tickets</Link></li>
                </ul>
            </div>
        </div>
    );
};

export default Admin;
