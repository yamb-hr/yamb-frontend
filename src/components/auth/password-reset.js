import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ErrorContext } from '../../providers/errorProvider';
import { CurrentUserContext } from '../../providers/currentUserProvider';
import authService from '../../services/authService';
import './auth.css';
import playerService from '../../services/playerService';

function PasswordReset() {

    const navigate = useNavigate();
    const { t } = useTranslation();
    const { handleError } = useContext(ErrorContext);
    const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
    const [ newPassword, setNewPassword ] = useState('');
    const [ oldPassword, setOldPassword ] = useState('');
    const [ errors, setErrors ] = useState({});

    function handleSubmit(event) {
        event.preventDefault();

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        authService.resetPassword({ oldPassword: oldPassword, newPassword: newPassword})
        .then(() => {
            navigate("/profile")
            playerService.getCurrentPlayer().then(player => {
                setCurrentUser(player);
            }).catch(error => {
                handleError(error);
            });
        })
        .catch((error) => {
            handleError(error); 
        });
    };

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
    };

    function handleOldPasswordChange(event) {
        setOldPassword(event.target.value);
    };

    return (
        <div className="login-container">
            <img src="/logo.png" alt="Yamb" />
            <h2>{t('reset-password')}</h2>
            <form onSubmit={handleSubmit}>
                {currentUser?.registered && (<div>
                    <label className="input-label" htmlFor="password">{t('old-password')}</label>
                    <input 
                        type="password" 
                        name="oldPassword" 
                        autoComplete="username" 
                        value={oldPassword} 
                        onChange={handleOldPasswordChange} 
                        placeholder={t('enter-old-password')} 
                        required
                    />
                </div>)}

                <label className="input-label" htmlFor="password">{t('new-password')}</label>
                <input 
                    type="password" 
                    name="newPassword" 
                    value={newPassword}  
                    onChange={handleNewPasswordChange} 
                    placeholder={t('enter-new-password')} 
                    required
                />
                {errors.password && <span className="error-text">{errors.newPassword}</span>}
                <input type="submit" value={t('reset-password')} />
            </form>
        </div>
    )
}

export default PasswordReset;