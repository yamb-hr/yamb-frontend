import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import authService from '../../services/authService';
import './auth.css';
import { CurrentUserContext } from '../../providers/currentUserProvider';
import { ErrorContext } from '../../providers/errorProvider';

function Login() {

    const navigate = useNavigate();
    const { t } = useTranslation();
    const { setCurrentUser } = useContext(CurrentUserContext);
    const { handleError } = useContext(ErrorContext);
    const [ username, setUsername ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ errors, setErrors ] = useState({});

    function handleSubmit(event) {
        event.preventDefault();

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        authService.getToken({ username: username, password: password})
        .then((authData) => {
            localStorage.setItem("token", authData.token);
            setCurrentUser(authData.player);
            navigate("/");
        })
        .catch((error) => {
            handleError(error); 
        });
    };

    function validateForm() {
        let validationErrors = {};
        if (username.length < 3 || username.length > 15) {
            validationErrors.username = t('username-length-invalid');
        }
        if (password.length < 6 || password.length > 30) {
            validationErrors.password = t('password-length-invalid');
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
        <div className="auth-container">
            <div className="auth">
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
                        placeholder={t('enter-password')} 
                        required
                    />
                    {errors.password && <span className="error-text">{errors.password}</span>}

                    <input type="submit" value={t('sign-in')} />
                    
                    <div className="link">
                        {t('dont-have-account')}&nbsp;
                        <Link to="/register">{t('sign-up')}</Link><br/>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login;
