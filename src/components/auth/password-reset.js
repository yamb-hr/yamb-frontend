import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ErrorHandlerContext } from '../../providers/errorHandlerProvider';
import { ToastContext } from '../../providers/toastProvider';
import { CurrentUserContext } from '../../providers/currentUserProvider';
import authService from '../../services/authService';
import playerService from '../../services/playerService';
import './auth.css';

function PasswordReset() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { handleError } = useContext(ErrorHandlerContext);
    const { showSuccessToast } = useContext(ToastContext);
    const { currentUser, setCurrentUser } = useContext(CurrentUserContext);

    const [newPassword, setNewPassword] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [searchParams] = useSearchParams();

    const [isTokenBased, setIsTokenBased] = useState(false);

    useEffect(() => {
        // Check if the URL contains a `token` query parameter
        const token = searchParams.get('token');
        if (token) {
            setIsTokenBased(true);
        }
    }, [searchParams]);

    function handleSubmit(event) {
        event.preventDefault();

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        authService.resetPassword(oldPassword, newPassword, searchParams.get('token'))
            .then(() => {
                navigate('/profile');
                playerService
                    .getCurrentPlayer()
                    .then((player) => {
                        setCurrentUser(player);
                    })
                    .catch((error) => {
                        handleError(error);
                    });
            }).catch((error) => {
                handleError(error);
            });
    }

    function validateForm() {
        let validationErrors = {};
        if (newPassword.length < 6 || newPassword.length > 30) {
            validationErrors.newPassword = t('password-length-invalid');
        }
        return validationErrors;
    }

    function handleNewPasswordChange(event) {
        setNewPassword(event.target.value);
        if (errors.newPassword) {
            setErrors((prevErrors) => ({ ...prevErrors, password: '' }));
        }
    }

    function handleOldPasswordChange(event) {
        setOldPassword(event.target.value);
    }

    return (
        <div className="auth-container">
            <div className="auth">
                <img src="/logo.png" alt="Yamb" />
                <h2>{t('reset-password')}</h2>
                <form onSubmit={handleSubmit}>
                    {!isTokenBased && (
                        <div>
                            <label className="input-label" htmlFor="oldPassword">{t('old-password')}</label>
                            <input
                                type="password"
                                name="oldPassword"
                                autoComplete="username"
                                value={oldPassword}
                                onChange={handleOldPasswordChange}
                                placeholder={t('enter-old-password')}
                                required
                            />
                        </div>
                    )}

                    <label className="input-label" htmlFor="newPassword">{t('new-password')}</label>
                    <input
                        type="password"
                        name="newPassword"
                        value={newPassword}
                        onChange={handleNewPasswordChange}
                        placeholder={t('enter-new-password')}
                        required
                    />
                    {errors.newPassword && <span className="error-text">{errors.newPassword}</span>}
                    <input type="submit" value={t('reset-password')} />
                    {!isTokenBased && (
                        <div className="link">
                            <Link to="/forgot-password">
                                {t('forgot-password')}
                            </Link>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}

export default PasswordReset;
