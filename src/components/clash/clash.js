import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ErrorContext } from '../../providers/errorProvider';
import clashService from '../../services/clashService';
import Element from '../element/element';
import Spinner from '../spinner/spinner';
import Table from '../table/table';
import Game from '../game/game';
import './clash.css';

function Clash() {

    const { id } = useParams();
    const { handleError } = useContext(ErrorHandlerContext);

    const [ data, setData ] = useState(null);
    const [ loading, setLoading ] = useState(true);
    

    useEffect(() => {
        if (id && !data) {
            fetchData();
        }
    }, [id]);

    const fetchData = () => {
        setLoading(true);
        clashService.getById(id).then(data => {
            setData(data);
        }).catch(error => {
            handleError(error);
        }).finally(() => {
            setLoading(false);
        });
    }

    const columns = [
        { label: 'Id', key: 'id' },
        { label: 'Owner', key: 'owner' },
        { label: 'Status', key: 'status' },
        { label: 'Type', key: 'type' },
        { label: 'Turn', key: 'turn' },
        { label: 'Winner', key: 'winner' },
        { label: 'Started', key: 'createdAt' },
        { label: 'Last Played', key: 'updatedAt' }
    ];

    const playerColumns = [
        { label: 'Player', key: 'name' }
    ];

    if (loading) {
        return (<Spinner />);
    }

    const handleFill = () => {
        setTimeout(() => {
            fetchData();
        }, 1000);
    }

    if (data?.status == "IN_PROGRESS") {
        console.log(data.players[data.turn].gameId)
        return (
            <Game 
                id={data.players[data.turn].gameId}
                onFill={handleFill}
            />
        );
    }

    return (
        <div className="clash">
            <button className="button-play">Play</button>
            {data && <Element data={data} columns={columns}></Element>}
            <br/>
            {data && data.players && <Table data={data.players} columns={playerColumns}></Table>}
        </div>
    );

};

export default Clash;