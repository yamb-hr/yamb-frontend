import React, { useContext, useEffect, useState } from 'react';
import { CurrentUserContext, ErrorContext } from '../../App';
import authService from '../../services/authService';
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
                authService.createTempPlayer({username: username}, recaptchaToken)
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
            <img src="/logo.png" alt="Yamb" />
            <h2>{t('play-as-guest')}</h2>
            <form onSubmit={handleSubmit}>
                <label className="input-label" htmlFor="username">{t('username')}</label>
                <input type="text" name="username" autoComplete="username" value={username} onChange={handleUsernameChange} placeholder={t('enter-username')} required/>
                <input type="submit" value={t('play')} disabled={isPlayDisabled} />
                <div className="link">
                    {t('already-have-account')}&nbsp;
                    <a href="/login">{t('sign-in')}</a><br/>
                </div>
                {/* <hr/>
                <div className="oauth">
                    <a href="/auth/google"><img></img></a>
                    <a href="/auth/facebook"><img></img></a>
                    <a href="/auth/github"><img></img></a>
                </div> */}
            </form>
        </div>
    );
};

export default TempPlayer;
