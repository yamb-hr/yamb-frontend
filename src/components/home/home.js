import React, { useContext } from 'react';
import { CurrentUserContext } from '../../providers/currentUserProvider';
import RegisterGuest from '../auth/register-guest';
import Game from '../game/game';
import Spinner from '../spinner/spinner';

function Home() {

    const { currentUser, loading } = useContext(CurrentUserContext);

    if (loading) {
        return <Spinner />
    } 
    
    if (currentUser) {
        return <Game />;
    } else {
        return <RegisterGuest />;
    }

};

export default Home;
