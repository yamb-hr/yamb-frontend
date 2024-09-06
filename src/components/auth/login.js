import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import { CurrentUserContext, ErrorContext } from '../../App';
import { useTranslation } from 'react-i18next';
import './auth.css';

function Login() {

    const navigate = useNavigate();
    const { t } = useTranslation();
    const { handleError } = useContext(ErrorContext);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const { setCurrentUser } = useContext(CurrentUserContext);

    function handleSubmit(event) {
        event.preventDefault();

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        authService.login({
            username: username,
            password: password
        })
        .then((authData) => {
            localStorage.setItem("player", JSON.stringify(authData.player));
            localStorage.setItem("token", authData.token);
            setCurrentUser(authData.player);
            navigate("/");
            window.location.reload();
        })
        .catch((error) => {
            handleError(error); 
        });
    };

    function validateForm() {
        let validationErrors = {};
        if (username.length < 5) {
            validationErrors.username = t('username-must-be-5-chars');
        }
        if (password.length < 5) {
            validationErrors.password = t('password-must-be-5-chars');
        }
        return validationErrors;
    }

    function handleUsernameChange(event) {
        setUsername(event.target.value);
        if (errors.username) {
            setErrors((prevErrors) => ({ ...prevErrors, username: '' }));
        }
    };

    function handlePasswordChange(event) {
        setPassword(event.target.value);
        if (errors.password) {
            setErrors((prevErrors) => ({ ...prevErrors, password: '' }));
        }
    };

    return (
        <div className="login-container">
            <img src="/logo.png" alt="Yamb" />
            <h2>{t('login')}</h2>
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

                <label className="input-label" htmlFor="password">{t('password')}</label>
                <input 
                    type="password" 
                    name="password" 
                    autoComplete="current-password" 
                    value={password}  
                    onChange={handlePasswordChange} 
                    placeholder={t('enter-password') + "..."} 
                    required
                />
                {errors.password && <span className="error-text">{errors.password}</span>}

                <input type="submit" value={t('sign-in')} />
                
                <div className="link">
                    {t('dont-have-account')}&nbsp;
                    <a href="/register">{t('sign-up')}</a><br/>
                </div>
            </form>
        </div>
    );
};

export default Login;
