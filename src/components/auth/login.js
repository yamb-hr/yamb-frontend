import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../../services/authService';
import { CurrentUserContext, ErrorContext } from '../../App';
import { useTranslation } from 'react-i18next';
import './auth.css';

function Login() {

    const navigate = useNavigate();
    const { t } = useTranslation();
    const { handleError } = useContext(ErrorContext);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoginDisabled, setLoginDisabled] = useState(true);
    const { setCurrentUser } = useContext(CurrentUserContext);

    function handleSubmit(event) {
        event.preventDefault();
        AuthService.login({
            username: username,
            password: password
        })
        .then((authData) => {
            localStorage.setItem("player", JSON.stringify(authData.player));
            localStorage.setItem("token", authData.token);
            setCurrentUser(authData.player);
            navigate("/");
            window.location.reload();
        })
        .catch((error) => {
            handleError(error); 
        });
    };

    useEffect(() => {
        if (isLoginDisabled && username.length >= 5 && password.length >= 5) {
            setLoginDisabled(false);
        } else if (!isLoginDisabled && (username.length < 5 || password.length < 5)) {
            setLoginDisabled(true);
        }
    }, [username, password]);

    function handleUsernameChange(event) {
        setUsername(event.target.value);
    };

    function handlePasswordChange(event) {
        setPassword(event.target.value);
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit}>
                <input type="text" name="username" autComplete="username" value={username} onChange={handleUsernameChange} placeholder={t('username') + "..."} required/>
                <input type="password" name="password" autoComplete="current-password" value={password}  onChange={handlePasswordChange} placeholder={t('password') + "..."} required/>
                <input type="submit" value={t('login')} disabled={isLoginDisabled} />
                <div className="link">
                    <a href="/" style={{ float: "left" }}>{t('play')}</a>
                    <a href="/register" style={{ float: "right" }}>{t('register')}</a>
                </div>
            </form>
        </div>
    );
};

export default Login;
