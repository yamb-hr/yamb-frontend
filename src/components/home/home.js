import React, { useContext } from 'react';
import { CurrentUserContext } from '../../providers/currentUserProvider';
import RegisterGuest from '../auth/register-guest';
import Game from '../game/game';

function Home() {

    const { currentUser } = useContext(CurrentUserContext);

    if (currentUser) {
        return <Game></Game>;
    } else {
        return <RegisterGuest></RegisterGuest>;
    }

};

export default Home;
