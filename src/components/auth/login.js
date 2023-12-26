import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../api/auth-service';
import { ErrorContext } from '../../App';
import { useTranslation } from 'react-i18next';
import './auth.css';

function Login() {

    const navigate = useNavigate();
    const { t } = useTranslation();
    const { handleError } = useContext(ErrorContext);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    function handleSubmit() {
        AuthService.login({
            username: username,
            password: password
        })
        .then((player) => {
            console.log(player);
            localStorage.setItem("player", JSON.stringify(player)); 
            navigate("/");
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

    const loginDisabled = username.length < 5 || username.length > 15 || !password;

    return (
        <div className="login">
            <div className="form">
                <input
                    className="username-input"
                    type="text"
                    value={username}
                    onChange={handleUsernameChange}
                    placeholder={t('username') + "..."} />
                <br />
                <input
                    className="password-input"
                    type="password"
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder={t('password') + "..."} />
                <br />
                <button
                    className="login-button"
                    disabled={loginDisabled}
                    onClick={handleSubmit}>
                    {t('login')}
                </button>
                <br />
                <span style={{ float: "left" }}><a href="/">{t('play')}</a></span>
                <span style={{ float: "right" }}><a href="/register">{t('register')}</a></span>
                <br />
            </div>
        </div>
    );
};

export default Login;
