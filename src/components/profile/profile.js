import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContext } from '../../providers/toastProvider';
import { AuthenticationContext } from '../../providers/authenticationProvider';
import { ErrorHandlerContext } from '../../providers/errorHandlerProvider';
import { useTranslation } from 'react-i18next';
import authService from '../../services/authService';
import playerService from '../../services/playerService';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import './profile.css';

function Profile() {

    const navigate = useNavigate();
    const { t } = useTranslation();
    
    const { currentUser, setCurrentUser } = useContext(AuthenticationContext);
    const { handleError } = useContext(ErrorHandlerContext);
    const { showInfoToast, showSuccessToast } = useContext(ToastContext);

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [avatar, setAvatar] = useState('');
    const [uploading, setUploading] = useState(false);
    const [errors, setErrors] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [emailVerified, setEmailVerified] = useState(false);

    const [image, setImage] = useState('');
    const [isCropping, setIsCropping] = useState(false);
    const cropperRef = useRef(null);

    useEffect(() => {
        if (currentUser) {
            setUsername(currentUser.name);
            setEmail(currentUser.email || '');
            setAvatar(currentUser.avatar?.url || '/img/avatar.png');
            setEmailVerified(currentUser.emailVerified || false);
        }
    }, [currentUser, navigate]);

    function handleAvatarUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            setImage(reader.result);
            setIsCropping(true);
        };
        reader.readAsDataURL(file);
    };

    async function handleCrop() {
        const cropper = cropperRef.current?.cropper;
        if (cropper) {
            const canvas = cropper.getCroppedCanvas({ width: 300, height: 300 });
            const croppedBase64 = canvas.toDataURL();
            setAvatar(croppedBase64);
            setIsCropping(false);

            setUploading(true);
            canvas.toBlob(async (blob) => {
                const file = new File([blob], 'avatar.png', { type: 'image/png' });
                try {
                    const player = await playerService.updateAvatar(currentUser, file);
                    setCurrentUser(player);
                    setAvatar(player.avatar?.url);
                    showInfoToast(t('avatar-updated'));
                } catch (error) {
                    handleError(error);
                } finally {
                    setUploading(false);
                }
            }, 'image/png');
        }
    };

    async function handleSave() {
        const validationErrors = {
            ...validateUsername(),
            ...validateEmail(),
        };

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        if (username && username !== currentUser.name) {
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

    function validateUsername() {
        const errors = {};
        const usernameRegex = /^[a-zA-Z][a-zA-Z0-9]{2,14}$/;
        if (!usernameRegex.test(username)) {
            errors.username = t('username-invalid');
        }
        return errors;
    };

    function validateEmail() {
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


    function handleToggleEditing() {
        if (isEditing) {
            setUsername(currentUser.name);
            setEmail(currentUser.email || '');
            setErrors([]);
        }
        setIsEditing(!isEditing);
    }

    return (
        <div className="profile-container"> 
            <div className="profile id-card">
                <div className="id-card-header">
                    <div className="avatar-container">
                        <img src={avatar} alt="Avatar" className="id-card-avatar" />
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
                            <label htmlFor="username">{t('username')}</label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={handleChange(setUsername)}
                                disabled={!isEditing}
                                className="id-card-input"
                                placeholder={t("enter-username")}
                            />
                            {errors.username && <span className="error-text">{errors.username}</span>}
                        </div>
                    </div>
                </div>
                <div className="id-card-body">
                    <div className="input-group">
                        <label htmlFor="email">{t('email')}</label>
                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={handleChange(setEmail)}
                            disabled={!isEditing}
                            className="id-card-input"
                            placeholder={t("enter-email")}
                        />
                        <div className="verified">
                            {t('verified')}:{' '}<strong style={{ color: emailVerified ? 'green' : 'red' }}>
                                {emailVerified ? '✔' : '✖'}
                            </strong>
                        </div>
                        {errors.email && <span className="error-text">{errors.email}</span>}
                    </div>
                    {!emailVerified && !isEditing && currentUser.email && (
                        <button onClick={handleResendVerificationEmail} className="button-resend-verification-email">
                            {t('resend-verification-email')}
                        </button>
                    )}
                    {isEditing && (
                        <button onClick={handleSave} className="save-button">
                            {t('save')}
                        </button>
                    )}
                    <button onClick={handleToggleEditing} className={(isEditing ? 'cancel' : 'edit')+'-button'}>
                        {isEditing ? t('cancel') : t('edit')}
                    </button>   
                </div>
                <Link to="/password-reset" className="reset-link">
                    {t('reset-password')}
                </Link>
            </div>
            {isCropping && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>{t('crop-image')}</h3>
                        <Cropper
                            src={image}
                            style={{ height: 300, width: '100%' }}
                            initialAspectRatio={1}
                            aspectRatio={1}
                            guides={true}
                            ref={cropperRef}
                        />
                        <div className="modal-actions">
                            <button onClick={() => setIsCropping(false)} className="cancel-button">{t('cancel')}</button>
                            <button onClick={handleCrop} className="save-button">{t('crop')}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Profile;
