import React, { useContext, useEffect } from 'react';
import { CurrentUserContext } from '../../providers/currentUserProvider';
import Game from '../game/game';
import Spinner from '../spinner/spinner';

function Home() {
    
    const { currentUser, registerGuest } = useContext(CurrentUserContext);

    useEffect(() => {
        if (!currentUser) {
            registerGuest();
        }
    }, [currentUser, registerGuest]);

    if (currentUser) {
        return <Game />;
    }

    return <Spinner />;
}

export default Home;
