import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CurrentUserContext } from '../../providers/currentUserProvider';
import { ErrorContext } from '../../providers/errorProvider';
import { useTranslation } from 'react-i18next';
import playerService from '../../services/playerService';
import './profile.css';

function Profile() {

    const { t } = useTranslation();
    const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
    const { handleError } = useContext(ErrorContext);
    const [ username, setUsername ] = useState('');
    const [ errors, setErrors ] = useState({});
    const [ isEditing, setIsEditing ] = useState(false);  // New state for edit mode

    useEffect(() => {
        if (currentUser) {
            setUsername(currentUser.name);
        }
    }, [currentUser]);

    function handleSubmit(event) {
        event.preventDefault();

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        playerService.changeUsername(currentUser, username)
            .then((player) => {
                setCurrentUser(player);
                setIsEditing(false);
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
        return validationErrors;
    }

    function handleUsernameChange(event) {
        setUsername(event.target.value);
        if (errors.username) {
            setErrors((prevErrors) => ({ ...prevErrors, username: '' }));
        }
    };

    const submitDisabled = currentUser?.name === username;

    return (
        <div className="profile-container">
            <div className="profile">
                <form onSubmit={handleSubmit}>
                        {isEditing ? (
                            <div className="username">
                                <input type="text" onChange={handleUsernameChange} value={username}/>
                                <div className="edit-button" onClick={() => setIsEditing(false)} aria-label="Cancel">&#10060;</div>   
                            </div>
                        ) : (<div className="username">
                                <input type="text" disabled={true} value={username}/>
                                <div className="edit-button" onClick={() => setIsEditing(true)} aria-label="Edit Username">✏️</div>
                            </div>
                        )}
                    <input type="submit" value={t('submit')} disabled={submitDisabled}/>
                </form>
                <br/>
                <div>
                    <Link to="/password-reset">{t('reset-password')}</Link>
                </div>
            </div>
        </div>
    );
}

export default Profile;
