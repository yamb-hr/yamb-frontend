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
                <Link to="/logs">{t("logs")}</Link>
                <Link to="/games">{t("games")}</Link>
                <Link to="/players">{t("players")}</Link>
                <Link to="/scores">{t("scores")}</Link>
                <Link to="/clashes">{t("clashes")}</Link>
                <Link to="/tickets">{t("tickets")}</Link>
            </div>
        </div>
    );
};

export default Admin;
