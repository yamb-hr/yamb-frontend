import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CurrentUserContext } from '../../providers/currentUserProvider';
import './admin.css';

function Admin() {

    const navigate = useNavigate();   
    const { t } = useTranslation();

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
                    <li><Link to="/logs">{t("logs")}</Link></li>
                    <li><Link to="/games">{t("games")}</Link></li>
                    <li><Link to="/players">{t("players")}</Link></li>
                    <li><Link to="/scores">{t("scores")}</Link></li>
                    <li><Link to="/clashes">{t("clashes")}</Link></li>
                    <li><Link to="/tickets">{t("tickets")}</Link></li>
                </ul>
            </div>
        </div>
    );
};

export default Admin;
