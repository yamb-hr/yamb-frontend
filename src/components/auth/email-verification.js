import React, { useContext, useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ErrorHandlerContext } from '../../providers/errorHandlerProvider';
import authService from '../../services/authService';
import './auth.css';

function EmailVerification() {

    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const { handleError } = useContext(ErrorHandlerContext);

    useEffect(() => {
        const token = searchParams.get('token');
        if (!token) {
            setMessage(t('token-missing'));
            setIsSuccess(false);
            return;
        }

        authService
            .verifyEmail(token)
            .then(() => {
                setMessage(t('email-verification-success'));
                setIsSuccess(true);
            })
            .catch((error) => {
                handleError(error);
                setMessage(t('email-verification-failed'));
                setIsSuccess(false);
            });
    }, [searchParams, t]);

    useEffect(() => {
        console.log("here");
    }, []);

    return (
        <div className="auth-container">
            <div className="auth">
                <img src="/logo.png" alt="Yamb" />
                <p className={isSuccess ? 'success-message' : 'error-message'}>
                    {message}
                </p>
                {isSuccess && (
                    <button
                        className="submit-button"
                        onClick={() => navigate('/login')}
                    >
                        {t('go-to-login')}
                    </button>
                )}
            </div>
        </div>
    );
}

export default EmailVerification;