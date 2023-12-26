import React, { useContext, useState } from 'react';
import AuthService from '../../api/auth-service';
import { Slide, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CurrentUserContext, ErrorContext, ThemeContext } from '../../App';
import './auth.css';

function Register() {
    
    const { t} = useTranslation();
    const { theme } = useContext(ThemeContext);
    const { currentUser } = useContext(CurrentUserContext);
    const { handleError } = useContext(ErrorContext);
    const [ username, setUsername ] = useState(currentUser ? currentUser.username : "Player" + Math.round(Math.random() * 10000));
    const [ password, setPassword ] = useState('');
    const [ repeatPassword, setRepeatPassword ] = useState('');
    const navigate = useNavigate();

    function handleSubmit() {
        AuthService.register({
            username: username,
            password: password
        })
        .then((player) => {
            console.log(player);
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
            handleError(error.message);
        });
    };

    function handleUsernameChange(event) {
        setUsername(event.target.value);
    };

    function handlePasswordChange(event) {
        setPassword(event.target.value);
    };

    function handleRepeatPasswordChange(event) {
        setRepeatPassword(event.target.value);
    };

    const registerDisabled = username.length < 5 || username.length > 15 || !password || (password !== repeatPassword);

    return (
        <div>
            <div className="form">
                <input
                    className="username-input"
                    type="text"
                    value={username}
                    onChange={handleUsernameChange}
                    placeholder={t('username') + "..."} >
                </input>
                <br />
                <input
                    className="password-input"
                    type="password"
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder={t('password') + "..."} >
                </input>
                <br />
                <input
                    className="password-input"
                    type="password"
                    value={repeatPassword}
                    onChange={handleRepeatPasswordChange}
                    placeholder={t('password') + "..."} >
                </input>
                <br />
                <button className="register-button" disabled={registerDisabled} onClick={handleSubmit}>{t('register')}</button>
                <br />
                <span style={{ float: "left" }}><a href="/">{t('play')}</a></span>
                <span style={{ float: "right" }}><a href="/login">{t('login')}</a></span>
                <br />
            </div>
        </div>
    );
};

export default Register;
