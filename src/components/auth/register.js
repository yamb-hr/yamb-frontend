import React, { useContext, useEffect, useState } from 'react';
import { AuthService } from '../../services/authService';
import { Slide, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CurrentUserContext, ErrorContext, ThemeContext } from '../../App';
import './auth.css';


function Register() {

    const RECAPTCHA_SITE_KEY = process.env.REACT_APP_RECAPTCHA_SITE_KEY;
    
    const { t} = useTranslation();
    const { theme } = useContext(ThemeContext);
    const { currentUser } = useContext(CurrentUserContext);
    const { handleError } = useContext(ErrorContext);
    const [ username, setUsername ] = useState(currentUser ? currentUser.username : "");
    const [ password, setPassword ] = useState('');
    const [ repeatPassword, setRepeatPassword ] = useState('');
    const [ isRegisterDisabled, setRegisterDisabled ] = useState(true);
    const navigate = useNavigate();

    function handleSubmit(event) {
        event.preventDefault();
        window.grecaptcha.ready(() => {
            window.grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: 'register' }).then((token) => {
                AuthService.register({
                    username: username,
                    password: password
                }, token)
                .then((player) => {
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
                    handleError(error);
                });
            });
        });
    };

    useEffect(() => {
        if (isRegisterDisabled && username.length >= 5 && password.length >= 5 && password === repeatPassword) {
            setRegisterDisabled(false);
        } else if (!isRegisterDisabled && (username.length < 5 || password.length < 5 || password !== repeatPassword)) {
            setRegisterDisabled(true);
        }
    }, [username, password, repeatPassword]);

    function handleUsernameChange(event) {
        setUsername(event.target.value);
    };

    function handlePasswordChange(event) {
        setPassword(event.target.value);
    };

    function handleRepeatPasswordChange(event) {
        setRepeatPassword(event.target.value);
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit}>
                <input type="text" name="username" autoComplete="username" value={username} onChange={handleUsernameChange} placeholder={t('username') + "..."} required/>
                <input type="password" name="password" autoComplete="new-password" value={password}  onChange={handlePasswordChange} placeholder={t('password') + "..."} required/>
                <input type="password" name="password" autoComplete="new-password" value={repeatPassword} onChange={handleRepeatPasswordChange} placeholder={t('password') + "..."} required/>
                <input type="submit" value={t('register')} disabled={isRegisterDisabled} />
                <div className="link">
                    <a href="/" style={{ float: "left" }}>{t('play')}</a>
                    <a href="/login" style={{ float: "right" }}>{t('login')}</a>
                </div>
            </form>
        </div>
        // <div className="login-container">
        //     <form>
        //         <input
        //             className="username-input"
        //             type="text"
        //             value={username}
        //             onChange={handleUsernameChange}
        //             placeholder={t('username') + "..."} >
        //         </input>
        //         <br />
        //         <input
        //             className="password-input"
        //             type="password"
        //             value={password}
        //             onChange={handlePasswordChange}
        //             placeholder={t('password') + "..."} >
        //         </input>
        //         <br />
        //         <input
        //             className="password-input"
        //             type="password"
        //             value={repeatPassword}
        //             onChange={handleRepeatPasswordChange}
        //             placeholder={t('password') + "..."} >
        //         </input>
        //         <br />
        //         <button className="register-button" disabled={registerDisabled} onClick={handleSubmit}>{t('register')}</button>
        //         <br />
        //         <span style={{ float: "left" }}><a href="/">{t('play')}</a></span>
        //         <span style={{ float: "right" }}><a href="/login">{t('login')}</a></span>
        //         <br />
        //     </form>
        // </div>
    );
};

export default Register;
