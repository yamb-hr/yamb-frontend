import React, { useContext, useEffect, useState } from 'react';
import { CurrentUserContext, ErrorContext } from '../../App';
import authService from '../../services/authService';
import { useTranslation } from 'react-i18next';
import './auth.css';

function TempPlayer() {

    const RECAPTCHA_SITE_KEY = process.env.REACT_APP_RECAPTCHA_SITE_KEY;
    
    const { t } = useTranslation();
    const [username, setUsername] = useState("");
    const [errors, setErrors] = useState({});
    const { handleError } = useContext(ErrorContext);
    const { setCurrentUser } = useContext(CurrentUserContext);


    function handleSubmit(event) {
        event.preventDefault();

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

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

    function validateForm() {
        let validationErrors = {};
        if (username.length < 5) {
            validationErrors.username = t('username-must-be-5-chars');
        }
        return validationErrors;
    }

    function handleUsernameChange(event) {
        setUsername(event.target.value);
        if (errors.username) {
            setErrors((prevErrors) => ({ ...prevErrors, username: '' }));
        }
    };

    return (
        <div className="login-container">
            <img src="/logo.png" alt="Yamb" />
            <h2>{t('play-as-guest')}</h2>
            <form onSubmit={handleSubmit}>
                <label className="input-label" htmlFor="username">{t('username')}</label>
                <input 
                    type="text" 
                    name="username" 
                    autoComplete="username" 
                    value={username} 
                    onChange={handleUsernameChange} 
                    placeholder={t('enter-username')} 
                    required
                />
                {errors.username && <span className="error-text">{errors.username}</span>}
                
                <input type="submit" value={t('play')} />
                
                <div className="link">
                    {t('already-have-account')}&nbsp;
                    <a href="/login">{t('sign-in')}</a><br/>
                </div>
            </form>
        </div>
    );
};

export default TempPlayer;
