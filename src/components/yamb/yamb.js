import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Clash from '../clash/clash';
import Profile from '../profile/profile';
import Rankings from '../rankings/rankings';
import Settings from '../settings/settings';
import About from '../about/about';
import Login from '../auth/login';
import Register from '../auth/register';
import Logout from '../auth/logout';
import Admin from '../admin/admin';
import Navigation from '../navigation/navigation';
import PasswordReset from '../auth/password-reset';
import ClashList from '../clash/clashList';
import GameList from '../game/gameList';
import Game from '../game/game';
import PlayerList from '../player/playerList';
import Player from '../player/player';
import ScoreList from '../scores/scoreList';
import Score from '../scores/score';
import LogList from '../log/logList';
import Log from '../log/log';
import TicketList from '../ticket/ticketList';
import Ticket from '../ticket/ticket';
import Home from '../home/home';
import EmailVerification from '../auth/email-verification';
import ForgotPassword from '../auth/forgot-password';

function Yamb() {

    const RECAPTCHA_SITE_KEY = process.env.REACT_APP_RECAPTCHA_SITE_KEY;

	useEffect(() => {
        const script = document.createElement('script');
        script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
        script.async = true;

        script.onerror = () => {
            console.error('Failed to load reCAPTCHA script');
        };

        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };

    }, [RECAPTCHA_SITE_KEY]);

    return (<Router>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/games" element={<GameList />} />
            <Route path="/games/:id" element={<Game />} />
            <Route path="/players" element={<PlayerList />} />
            <Route path="/players/:id" element={<Player />} />
            <Route path="/scores" element={<ScoreList />} />
            <Route path="/scores/:id" element={<Score />} />
            <Route path="/clashes" element={<ClashList />} />
            <Route path="/clashes/:id" element={<Clash />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/rankings" element={<Rankings />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/logout" element={<Logout />} />      
            <Route path="/password-reset" element={<PasswordReset />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/logs" element={<LogList />} />
            <Route path="/logs/:id" element={<Log />} />
            <Route path="/tickets" element={<TicketList />} />
            <Route path="/tickets/:id" element={<Ticket />} />
            <Route path="/email-verification" element={<EmailVerification />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
        <Navigation/>
        <div id="recaptcha-container"></div>
    </Router>)
}

export default Yamb;
