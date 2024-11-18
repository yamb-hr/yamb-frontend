import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CurrentUserContext } from '../../providers/currentUserProvider';
import { ErrorHandlerContext } from '../../providers/errorHandlerProvider';
import { useTranslation } from 'react-i18next';
import playerService from '../../services/playerService';
import authService from '../../services/authService'; // Added for sending verification email
import './profile.css';

function Profile() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
    const { handleError } = useContext(ErrorHandlerContext);

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [profilePicture, setProfilePicture] = useState('');
    const [errors, setErrors] = useState({});
    const [isEditingUsername, setIsEditingUsername] = useState(false);
    const [isEditingEmail, setIsEditingEmail] = useState(false);
    const [emailVerified, setEmailVerified] = useState(false);

    useEffect(() => {
        if (!currentUser) {
            // Redirect to login if user is not logged in
            navigate('/login');
            return;
        }
        setUsername(currentUser.name);
        setEmail(currentUser.email || '');
        setProfilePicture(currentUser.profilePicture || '');
        setEmailVerified(currentUser.emailVerified || false);
    }, [currentUser, navigate]);

    function handleUsernameSubmit(event) {
        event.preventDefault();
        const validationErrors = validateUsername();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        playerService
            .changeUsername(currentUser, username)
            .then((player) => {
                setCurrentUser(player);
                setIsEditingUsername(false);
            })
            .catch((error) => {
                handleError(error);
            });
    }

    function handleEmailSubmit(event) {
        event.preventDefault();
        const validationErrors = validateEmail();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        playerService
            .updateEmail(currentUser, email)
            .then((player) => {
                setCurrentUser(player);
                setIsEditingEmail(false);
            })
            .catch((error) => {
                handleError(error);
            });
    }

    function handleResendVerificationEmail() {
        if (!currentUser?.email) {
            handleError(t('email-missing'));
            return;
        }
        authService
            .sendVerificationEmail(currentUser.email)
            .then(() => {
                alert(t('verification-email-sent'));
            })
            .catch((error) => {
                handleError(error);
            });
    }

    function validateUsername() {
        const validationErrors = {};
        if (username.length < 3 || username.length > 15) {
            validationErrors.username = t('username-length-invalid');
        }
        return validationErrors;
    }

    function validateEmail() {
        const validationErrors = {};
        const emailRegex = /\S+@\S+\.\S+/;
        if (email && !emailRegex.test(email)) {
            validationErrors.email = t('email-invalid');
        }
        return validationErrors;
    }

    function handleUsernameChange(event) {
        setUsername(event.target.value);
        if (errors.username) {
            setErrors((prevErrors) => ({ ...prevErrors, username: '' }));
        }
    }

    function handleEmailChange(event) {
        setEmail(event.target.value);
        if (errors.email) {
            setErrors((prevErrors) => ({ ...prevErrors, email: '' }));
        }
    }

    const usernameSubmitDisabled = currentUser?.name === username;
    const emailSubmitDisabled = currentUser?.email === email;

    return (
        <div className="profile-container">
            <div className="profile">
                <h3>{t('profile')}</h3>

                {/* Username Section */}
                <section className="profile-section">
                    <form onSubmit={handleUsernameSubmit}>
                        <label>{t('username')}</label>
                        <div className="input-group">
                            <input
                                type="text"
                                value={username}
                                onChange={handleUsernameChange}
                                disabled={!isEditingUsername}
                                autoFocus={isEditingUsername}
                            />
                            <button
                                type="button"
                                className={isEditingUsername ? 'cancel-button' : 'edit-button'}
                                onClick={() => setIsEditingUsername(!isEditingUsername)}
                                aria-label={isEditingUsername ? 'Cancel' : 'Edit Username'}
                            >
                                {isEditingUsername ? '✖' : '✏️'}
                            </button>
                        </div>
                        {errors.username && <span className="error-text">{errors.username}</span>}
                        {isEditingUsername && (
                            <button type="submit" disabled={usernameSubmitDisabled}>
                                {t('save')}
                            </button>
                        )}
                    </form>
                </section>

                {/* Email Section */}
                <section className="profile-section">
                    <form onSubmit={handleEmailSubmit}>
                        <label>{t('email')}</label>
                        <div className="input-group">
                            <input
                                type="email"
                                value={email}
                                onChange={handleEmailChange}
                                disabled={!isEditingEmail}
                                autoFocus={isEditingEmail}
                            />
                            <button
                                type="button"
                                className={isEditingEmail ? 'cancel-button' : 'edit-button'}
                                onClick={() => setIsEditingEmail(!isEditingEmail)}
                                aria-label={isEditingEmail ? 'Cancel' : 'Edit Email'}
                            >
                                {isEditingEmail ? '✖' : '✏️'}
                            </button>
                        </div>
                        {errors.email && <span className="error-text">{errors.email}</span>}
                        {isEditingEmail && (
                            <button type="submit" disabled={emailSubmitDisabled}>
                                {t('save')}
                            </button>
                        )}
                    </form>
                    <div className="email-verification">
                        <p>
                            {t('verified')}:{' '}
                            <strong style={{ color: emailVerified ? 'green' : 'red' }}>
                                {emailVerified ? '✔' : '✖'}
                            </strong>
                        </p>
                        {!emailVerified && (
                            <button onClick={handleResendVerificationEmail}>
                                {t('resend-verification-email')}
                            </button>
                        )}
                    </div>
                </section>

                {/* Reset Password */}
                <section className="link">
                    <Link to="/password-reset" className="reset-link">
                        {t('reset-password')}
                    </Link>
                </section>
            </div>
        </div>
    );
}

export default Profile;
