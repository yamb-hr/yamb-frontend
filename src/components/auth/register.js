import React, { useContext, useEffect, useState } from 'react';
import { AuthService } from '../../services/authService';
import { Slide, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CurrentUserContext, ErrorContext, ThemeContext } from '../../App';
import './auth.css';


function Register() {

    const RECAPTCHA_SITE_KEY = process.env.REACT_APP_RECAPTCHA_SITE_KEY;
    
    const { t} = useTranslation();
    const { theme } = useContext(ThemeContext);
    const { currentUser } = useContext(CurrentUserContext);
    const { handleError } = useContext(ErrorContext);
    const [ username, setUsername ] = useState(currentUser ? currentUser.username : "");
    const [ password, setPassword ] = useState('');
    const [ isRegisterDisabled, setRegisterDisabled ] = useState(true);
    const navigate = useNavigate();

    function handleSubmit(event) {
        event.preventDefault();
        window.grecaptcha.ready(() => {
            window.grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: 'register' }).then((token) => {
                AuthService.register({
                    username: username,
                    password: password
                }, token)
                .then((player) => {
                    toast.success(t('registration-success'), {
                        position: "top-center",
                        autoClose: 2000,
                        transition: Slide,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: true,
                        pauseOnFocusLoss: true,
                        draggable: true,
                        progress: undefined,
                        theme: theme
                    });
                    navigate('/login');
                })
                .catch((error) => {
                    handleError(error);
                });
            });
        });
    };

    useEffect(() => {
        if (isRegisterDisabled && username.length >= 5 && password.length >= 5) {
            setRegisterDisabled(false);
        } else if (!isRegisterDisabled && (username.length < 5 || password.length < 5)) {
            setRegisterDisabled(true);
        }
    }, [username, password]);

    function handleUsernameChange(event) {
        setUsername(event.target.value);
    };

    function handlePasswordChange(event) {
        setPassword(event.target.value);
    };

    return (
        <div className="login-container">
            <img src="/logo.png" alt="Yamb" />
            <h2>{t('Register')}</h2>
            <form onSubmit={handleSubmit}>
                <label className="input-label" htmlFor="username">{t('username')}</label>
                <input type="text" name="username" autoComplete="username" value={username} onChange={handleUsernameChange} placeholder={t('enter-username')} required/>
                <label className="input-label" htmlFor="password">{t('password')}</label>
                <input type="password" name="password" autoComplete="new-password" value={password}  onChange={handlePasswordChange} placeholder={t('enter-password')} required/>
                <input type="submit" value={t('register')} disabled={isRegisterDisabled} />
                <div className="link">
                    {t('already-have-account')}&nbsp;
                    <a href="/login">{t('sign-in')}</a><br/>
                </div>
            </form>
        </div>
    );
};

export default Register;
