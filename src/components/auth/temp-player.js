import React, { useContext, useEffect, useState } from 'react';
import { CurrentUserContext, ErrorContext } from '../../App';
import { AuthService } from '../../services/authService';
import { useTranslation } from 'react-i18next';
import './auth.css';

function TempPlayer() {

    const RECAPTCHA_SITE_KEY = process.env.REACT_APP_RECAPTCHA_SITE_KEY;
    
    const { t } = useTranslation();
    const [ username, setUsername ] = useState("");
    const { handleError } = useContext(ErrorContext);
    const [ isPlayDisabled, setPlayDisabled ] = useState(true);    
    const { setCurrentUser } = useContext(CurrentUserContext);


    function handleSubmit(event) {
        event.preventDefault();
        window.grecaptcha.ready(() => {
            window.grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: 'register' })
            .then((recaptchaToken) => {
                AuthService.createTempPlayer({username: username}, recaptchaToken)
                .then((authData) => {
                    localStorage.setItem("player", JSON.stringify(authData.player));
                    localStorage.setItem("token", authData.token);
                    setCurrentUser(authData.player);
                })
                .catch((error) => {
                    handleError(error);
                });
            })
            .catch((error) => {
                console.error('reCAPTCHA v3 error:', error);
            });
        });
    };

    useEffect(() => {
        if (isPlayDisabled && username.length >= 5) {
            setPlayDisabled(false);
        } else if (!isPlayDisabled && username.length < 5) {
            setPlayDisabled(true);
        }
    }, [username]);

    function handleUsernameChange(event) {
        setUsername(event.target.value);
    };    

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit}>
                <input type="text" name="username" autoComplete="username" value={username} onChange={handleUsernameChange} placeholder={t('username') + "..."} required/>
                <input type="submit" value={t('play')} disabled={isPlayDisabled} />
                <div className="link">
                    <a href="/login" style={{ float: "left" }}>{t('login')}</a>
                    <a href="/register" style={{ float: "right" }}>{t('register')}</a>
                </div>
            </form>
        </div>
    );
};

export default TempPlayer;
