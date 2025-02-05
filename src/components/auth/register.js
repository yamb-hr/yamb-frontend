import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Slide, toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { PreferencesContext } from '../../providers/preferencesProvider';
import { ErrorHandlerContext } from '../../providers/errorHandlerProvider';
import { AuthenticationContext } from '../../providers/authenticationProvider';
import authService from '../../services/authService';
import './auth.css';

function Register() {

    const RECAPTCHA_SITE_KEY = process.env.REACT_APP_RECAPTCHA_SITE_KEY;

    const navigate = useNavigate();
    const { t } = useTranslation();

    const { theme } = useContext(PreferencesContext);
    const { handleError } = useContext(ErrorHandlerContext);
    const { currentUser } = useContext(AuthenticationContext);

    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState({});
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState(currentUser ? currentUser.username : "");

    function handleSubmit(event) {
        event.preventDefault();

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        window.grecaptcha.ready(() => {
            window.grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: 'register' }).then((token) => {
                authService.register({
                    username,
                    password,
                    email: email || null,
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
    }

    function validateForm() {
        let validationErrors = {};
        if (username.length < 3 || username.length > 15) {
            validationErrors.username = t('username-length-invalid');
        }
        if (password.length < 6 || password.length > 30) {
            validationErrors.password = t('password-length-invalid');
        }
        if (email && !/\S+@\S+\.\S+/.test(email)) {
            validationErrors.email = t('email-invalid');
        }
        if (username && !isValidUsername(username)) {
            validationErrors.username = t("username-invalid");
        }
        return validationErrors;
    }
    
    function isValidUsername(input) {
        const usernameRegex = /^[a-zA-Z][a-zA-Z0-9]{2,14}$/;
        return usernameRegex.test(input);
    }  

    function handleUsernameChange(event) {
        setUsername(event.target.value);
        if (errors.username) {
            setErrors((prevErrors) => ({ ...prevErrors, username: '' }));
        }
    }

    function handlePasswordChange(event) {
        setPassword(event.target.value);
        if (errors.password) {
            setErrors((prevErrors) => ({ ...prevErrors, password: '' }));
        }
    }

    function handleEmailChange(event) {
        setEmail(event.target.value);
        if (errors.email) {
            setErrors((prevErrors) => ({ ...prevErrors, email: '' }));
        }
    }

    return (
        <div className="auth-container">
            <div className="auth">
                <img src="/logo.png" alt="Yamb" />
                <h2>{t('Register')}</h2>
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

                    <label className="input-label" htmlFor="email">{t('email')} ({t('optional')})</label>
                    <input 
                        type="email" 
                        name="email" 
                        value={email} 
                        onChange={handleEmailChange} 
                        placeholder={t('enter-email')}
                    />
                    {errors.email && <span className="error-text">{errors.email}</span>}

                    <label className="input-label" htmlFor="password">{t('password')}</label>
                    <input 
                        type="password" 
                        name="password" 
                        autoComplete="new-password" 
                        value={password}  
                        onChange={handlePasswordChange} 
                        placeholder={t('enter-password')} 
                        required
                    />
                    {errors.password && <span className="error-text">{errors.password}</span>}

                    <input type="submit" value={t('register')} />
                    
                    <div className="link">
                        {t('already-have-account')}&nbsp;
                        <Link to="/login">{t('sign-in')}</Link><br />
                    </div>
                </form>
            </div>
        </div>
    );
    
}

export default Register;
