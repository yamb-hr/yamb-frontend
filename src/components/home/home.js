import React, { useContext, useEffect } from 'react';
import { AuthenticationContext } from '../../providers/authenticationProvider';
import Game from '../game/game';
import Spinner from '../spinner/spinner';

function Home() {
    
    const { currentUser, registerGuest } = useContext(AuthenticationContext);

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
