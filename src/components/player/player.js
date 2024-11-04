import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ErrorContext } from '../../providers/errorProvider';
import playerService from '../../services/playerService';
import Element from '../element/element';
import Collapsible from '../collapsible/collapsible';
import Spinner from '../spinner/spinner';
import Table from '../table/table';
import './player.css';
import { CurrentUserContext } from '../../providers/currentUserProvider';

function Player() {

    const { id } = useParams();
    const [ data, setData ] = useState(null);
    const [ scoreData, setScoreData ] = useState(null);
    const [ gameData, setGameData ] = useState(null);
    const [ logData, setLogData ] = useState(null);
    const [ loading, setLoading ] = useState(true);
    const { handleError } = useContext(ErrorContext);
    const { currentUser } = useContext(CurrentUserContext);

    useEffect(() => {
        if (id && !data) {
            fetchData();
        }
    }, [id]);

    useEffect(() => {
        if (id && data && !scoreData) {
            fetchScoreData();
        }
        if (id && data && !gameData) {
            fetchGameData();
        }
        if (id && data && !logData) {
            fetchLogData();
        }
    }, [id, data]);

    const fetchData = () => {
        setLoading(true);
        playerService.getById(id).then(data => {
            setData(data);
        }).catch(error => {
            handleError(error);
        }).finally(() => {
            setLoading(false);
        });
    }

    const fetchScoreData = () => {
        setLoading(true);
        playerService.getScoresByPlayerId(data).then(data => {
            setScoreData(data);
        }).catch(error => {
            handleError(error);
        }).finally(() => {
            setLoading(false);
        });
    }

    const fetchGameData = () => {
        setLoading(true);
        playerService.getGamesByPlayerId(data).then(data => {
            setGameData(data);
        }).catch(error => {
            handleError(error);
        }).finally(() => {
            setLoading(false);
        });
    }

    const fetchLogData = () => {
        setLoading(true);
        playerService.getLogsByPlayerId(data).then(data => {
            setLogData(data);
        }).catch(error => {
            handleError(error);
        }).finally(() => {
            setLoading(false);
        });
    }

    const columns = [
        { label: 'Name', key: 'name' },
        { label: 'Created Date', key: 'createdAt' },
        { label: 'Updated Date', key: 'updatedAt' }
    ];

    const scoreColumns = [
        { label: 'Value', key: 'value' },
        { label: 'Date', key: 'createdAt' }
    ];

    const gameColumns = [
        { label: 'Status', key: 'status', type: 'string' },
        { label: 'Last Played', key: 'updatedAt', type: 'date' }
    ];


    const logColumns = [
        { label: 'Level', key: 'level' },
        { label: 'Date', key: 'createdAt' }
    ];

    if (loading) {
        return (<Spinner></Spinner>);
    }

    return (
        <div className="player-container">
            <div className="player">
                {data && <Element data={data} columns={columns}></Element>}
                <br/>
                {scoreData && (
                    <Collapsible title="Scores">
                        <Table data={scoreData._embedded?.scores} columns={scoreColumns}></Table>
                    </Collapsible>
                )}
                <br/>
                {gameData && (
                    <Collapsible title="Games">
                        <Table data={gameData._embedded?.games} columns={gameColumns}></Table>
                    </Collapsible>
                )}
                <br/>
                {currentUser && currentUser.roles?.includes("ADMIN") && logData && (
                    <Collapsible title="Logs">
                        <Table data={logData._embedded?.logs} columns={logColumns}></Table>
                    </Collapsible>
                )}
            </div>
        </div>
    );
};

export default Player;