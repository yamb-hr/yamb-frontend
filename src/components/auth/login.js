import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CurrentUserContext } from '../../providers/currentUserProvider';
import { ErrorHandlerContext } from '../../providers/errorHandlerProvider';
import authService from '../../services/authService';
import './auth.css';

function Login() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { setCurrentUser } = useContext(CurrentUserContext);
    const { handleError } = useContext(ErrorHandlerContext);

    const [identifier, setIdentifier] = useState(''); // Unified field for username/email
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});

    function handleSubmit(event) {
        event.preventDefault();

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        authService.getToken({
            email: identifier.includes("@") ? identifier : undefined,
            username: !identifier.includes("@") ? identifier : undefined,
            password,
        }).then((authData) => {
            localStorage.setItem("token", authData.token);
            setCurrentUser(authData.player);
            navigate("/");
        }).catch((error) => {
            handleError(error);
        });
    }

    function validateForm() {
        let validationErrors = {};
        if (!isValidUsernameOrEmail(identifier)) {
            validationErrors.identifier = t('identifier-invalid');
        }
        if (password.length < 6 || password.length > 30) {
            validationErrors.password = t('password-length-invalid');
        }
        return validationErrors;
    }

    function isValidUsernameOrEmail(input) {
        const emailRegex = /\S+@\S+\.\S+/;
        const usernameRegex = /^[a-zA-Z0-9_]{3,15}$/; // Allow alphanumeric with underscores
        return emailRegex.test(input) || usernameRegex.test(input);
    }

    function handleIdentifierChange(event) {
        setIdentifier(event.target.value);
        if (errors.identifier) {
            setErrors((prevErrors) => ({ ...prevErrors, identifier: '' }));
        }
    }

    function handlePasswordChange(event) {
        setPassword(event.target.value);
        if (errors.password) {
            setErrors((prevErrors) => ({ ...prevErrors, password: '' }));
        }
    }

    return (
        <div className="auth-container">
            <div className="auth">
                <img src="/logo.png" alt="Yamb" />
                <h2>{t('login')}</h2>
                <form onSubmit={handleSubmit}>
                    <label className="input-label" htmlFor="identifier">{t('username-or-email')}</label>
                    <input
                        type="text"
                        name="identifier"
                        autoComplete="username"
                        value={identifier}
                        onChange={handleIdentifierChange}
                        placeholder={t('enter-username-or-email')}
                        required
                    />
                    {errors.identifier && <span className="error-text">{errors.identifier}</span>}

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
                        <Link to="/register">{t('sign-up')}</Link><br />
                    </div>
                    <div className="link">
                        <Link to="/forgot-password">
                            {t('forgot-password')}
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
