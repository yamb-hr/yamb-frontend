import React, { useContext, useEffect } from 'react';
import { CurrentUserContext } from '../../App';
import TempPlayer from '../auth/temp-player';
import Yamb from '../yamb/yamb';

function Play() {

    const { currentUser } = useContext(CurrentUserContext);

    useEffect(() => {
        console.log(process.env.REACT_APP_API_URL);
    }, []);    

    if (currentUser) {
        return <Yamb></Yamb>;
    } else {
        return <TempPlayer></TempPlayer>;
    }

};

export default Play;
