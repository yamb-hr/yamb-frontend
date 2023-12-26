import React, { useContext, useEffect } from 'react';
import { CurrentUserContext } from '../../App';
import TempPlayer from '../auth/temp-player';
import Yamb from '../yamb/yamb';
import './home.css';

function Home() {

    const { currentUser } = useContext(CurrentUserContext);

    useEffect(() => {
        console.log(process.env.REACT_APP_API_URL);
    }, []);    

    return (
        <div className="home">
            {currentUser ? <Yamb></Yamb> : <TempPlayer></TempPlayer> }
        </div>
    );
};

export default Home;
