import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ErrorHandlerContext } from '../../providers/errorHandlerProvider';
import { ToastContext } from '../../providers/toastProvider';
import { CurrentUserContext } from '../../providers/currentUserProvider';
import authService from '../../services/authService';
import './auth.css';
import { Link } from 'react-router-dom';

function ForgotPassword() {
    const { t } = useTranslation();
    const { handleError } = useContext(ErrorHandlerContext);
    const { showSuccessToast } = useContext(ToastContext);
    const { currentUser } = useContext(CurrentUserContext);

    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();
        authService
            .sendPasswordResetEmail(email)
            .then(() => {
                setSubmitted(true);
                showSuccessToast(t('password-reset-email-sent') + email);
            })
            .catch((error) => {
                handleError(error);
            });
    };

    return (
        <div className="auth-container">
            <div className="auth">
                <img src="/logo.png" alt="Yamb" />
                <h2>{t('forgot-password')}</h2>
                {currentUser ? (
                    <div className="forgot-password">
                        <p><strong>{currentUser.email}</strong></p>
                        <p>
                            {t('verified')}:{' '}
                            <strong style={{ color: currentUser?.emailVerified ? 'green' : 'red' }}>
                                {currentUser?.emailVerified ? '✔' : '✖'}{' '}
                            </strong>
                        </p>
                        <button disabled={!currentUser.emailVerified} className="button-send-password-reset-email"
                            onClick={() => authService.sendPasswordResetEmail(currentUser.email)
                                .then(() => showSuccessToast(t('password-reset-email-sent', { email: currentUser.email })))
                                .catch((error) => handleError(error))
                            }
                        >
                            {t('send-password-reset-email')}
                        </button>
                        <br/>
                        <div className="link">
                            {t('lost-email-access')}&nbsp;
                            <Link to="/profile">{t('update-email')}</Link><br />
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleFormSubmit}>
                        {!submitted ? (
                            <>
                                <label htmlFor="email" className="input-label">
                                    {t('email')}
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={email}
                                    onChange={handleEmailChange}
                                    placeholder={t('enter-email')}
                                    required
                                />
                                <input type="submit" value={t('send-password-reset-email')} />
                            </>
                        ) : (
                            <p className="check-email">{t('check-your-email', { email })}</p>
                        )}
                        <div className="link">
                            {t('already-have-account')}&nbsp;
                            <Link to="/login">{t('sign-in')}</Link><br />
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

export default ForgotPassword;
