import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContext } from '../../providers/toastProvider';
import { CurrentUserContext } from '../../providers/currentUserProvider';
import { ErrorHandlerContext } from '../../providers/errorHandlerProvider';
import { useTranslation } from 'react-i18next';
import authService from '../../services/authService';
import playerService from '../../services/playerService';
import './profile.css';

function Profile() {

    const navigate = useNavigate();
    const { t } = useTranslation();
    
    const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
    const { handleError } = useContext(ErrorHandlerContext);
    const { showInfoToast, showSuccessToast } = useContext(ToastContext);

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [avatar, setAvatar] = useState('');
    const [uploading, setUploading] = useState(false);
    const [errors, setErrors] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [emailVerified, setEmailVerified] = useState(false);

    useEffect(() => {
        if (currentUser) {
            setUsername(currentUser.name);
            setEmail(currentUser.email || '');
            setAvatar(currentUser.avatar?.url || '/img/avatar.png');
            setEmailVerified(currentUser.emailVerified || false);
        }
    }, [currentUser, navigate]);

    const handleAvatarUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;
        setUploading(true);
        playerService.updateAvatar(currentUser, file).then(player => {
            setCurrentUser(player);
            setAvatar(player.avatar?.url);
            showInfoToast(t('avatar-updated'));
        }).catch(error => {
            handleError(error);
        }).finally(() => {
            setUploading(false);
        });
    };

    const handleSave = async () => {
        const validationErrors = {
            ...validateUsername(),
            ...validateEmail()
        };

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        if (username !== currentUser.name) {
            playerService.updateUsername(currentUser, username).then(player => {
                setCurrentUser(player);
                showSuccessToast(t('username-updated'));
            }).catch(error => {
                handleError(error);
            });
        }
        if (email !== currentUser.email) {
            playerService.updateEmail(currentUser, email).then(player => {
                setCurrentUser(player);
                showInfoToast(t('verification-email-sent', { email }));
            }).catch(error => {
                handleError(error);
            });
        }
        setIsEditing(false);
    };

    const validateUsername = () => {
        const errors = {};
        if (username.length < 3 || username.length > 15) {
            errors.username = t('username-length-invalid');
        }
        return errors;
    };

    const validateEmail = () => {
        const errors = {};
        const emailRegex = /\S+@\S+\.\S+/;
        if (email && !emailRegex.test(email)) {
            errors.email = t('email-invalid');
        }
        return errors;
    };

    const handleChange = (setter) => (event) => {
        setter(event.target.value);
        setErrors((prevErrors) => ({ ...prevErrors, [event.target.name]: '' }));
    };

    function handleResendVerificationEmail() {
        if (!currentUser?.email) {
            handleError(t('email-missing'));
            return;
        }
        authService.sendVerificationEmail(currentUser.email)
            .then(() => {
                alert(t('verification-email-sent') + currentUser.email);
            })
            .catch((error) => {
                handleError(error);
            });
    }

    return (
        <div className="profile-container"> 
            <div className="profile id-card">
                <div className="id-card-header">
                    <div className="avatar-container">
                        <img
                            src={avatar}
                            alt="Avatar"
                            className="id-card-avatar"
                        />
                        <label htmlFor="avatar-upload" className="upload-label">
                            {t('upload')}
                        </label>
                        <input
                            id="avatar-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                            className="avatar-upload-input"
                        />
                    </div>
                    <div className="username-container">
                        <div className="input-group">
                            <input
                                type="text"
                                name="username"
                                value={username}
                                onChange={handleChange(setUsername)}
                                disabled={!isEditing}
                                className="id-card-input"
                            />
                            {errors.username && <span className="error-text">{errors.username}</span>}
                        </div>
                    </div>
                </div>
                <div className="id-card-body">
                    <div className="input-group">
                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={handleChange(setEmail)}
                            disabled={!isEditing}
                            className="id-card-input"
                        />
                        <div className="verified">
                            {t('verified')}:{' '}<strong style={{ color: emailVerified ? 'green' : 'red' }}>
                                {emailVerified ? '✔' : '✖'}
                            </strong>
                        </div>
                        {!emailVerified && !isEditing && (
                            <button onClick={handleResendVerificationEmail} className="button-resend-verification-email">
                                {t('resend-verification-email')}
                            </button>
                        )}
                        {errors.email && <span className="error-text">{errors.email}</span>}
                    </div>
                    {isEditing && (
                        <button onClick={handleSave} className="save-button">
                            {t('save')}
                        </button>
                    )}
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className={(isEditing ? 'cancel' : 'edit')+'-button'}
                    >
                        {isEditing ? t('cancel') : t('edit')}
                    </button>
                </div>
                <Link to="/password-reset" className="reset-link">
                    {t('reset-password')}
                </Link>
            </div>
        </div>
    );
}

export default Profile;
