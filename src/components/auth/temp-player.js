import React, { useContext, useState } from 'react';
import { CurrentUserContext, ErrorContext } from '../../App';
import AuthService from '../../api/auth-service';
import { useTranslation } from 'react-i18next';

function TempPlayer() {
    
    const { t } = useTranslation();
    const [ username, setUsername ] = useState("Player" + Math.round(Math.random() * 10000));
    const { setCurrentUser } = useContext(CurrentUserContext);
    const { handleError } = useContext(ErrorContext);

    function handleSubmit() {
        AuthService.createTempPlayer({
            username: username
        })
        .then((player) => {
            console.log(player);
            localStorage.setItem("player", JSON.stringify(player));
            setCurrentUser(player);
        })
        .catch((error) => {
            handleError(error);
        });
    };

    function handleUsernameChange(event) {
        setUsername(event.target.value);
    };

    let loginDisabled = username.length < 5 || username.length > 15;

    return (
        <div className="login">
            <div className="form">
                <input
                    className="username-input"
                    type="text"
                    value={username}
                    onChange={handleUsernameChange}
                    placeholder={t('username') + "..."}
                />
                <br />
                <button
                    className="login-button"
                    disabled={loginDisabled}
                    onClick={handleSubmit}>
                    {t('play')}
                </button>
                <br />
                <span style={{ float: "left" }}>
                    <a href="/login">{t('login')}</a>
                </span>
                <span style={{ float: "right" }}>
                    <a href="/register">{t('register')}</a>
                </span>
                <br />
            </div>
        </div>
    );
};

export default TempPlayer;
