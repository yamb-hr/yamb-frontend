import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ErrorHandlerContext } from '../../providers/errorHandlerProvider';
import { CurrentUserContext } from '../../providers/currentUserProvider';
import playerService from '../../services/playerService';
import Element from '../element/element';
import Collapsible from '../collapsible/collapsible';
import Spinner from '../spinner/spinner';
import Table from '../table/table';
import './player.css';

function Player() {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [scoreData, setScoreData] = useState(null);
    const [gameData, setGameData] = useState(null);
    const [logData, setLogData] = useState(null);
    const [loading, setLoading] = useState(true);

    const { handleError } = useContext(ErrorHandlerContext);
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
        if (currentUser.admin) {
            if (id && data && !gameData) {
                fetchGameData();
            }
            if (id && data && !logData) {
                fetchLogData();
            }
        }
    }, [id, data]);

    const fetchData = () => {
        setLoading(true);
        playerService
            .getById(id)
            .then((data) => setData(data))
            .catch(handleError)
            .finally(() => setLoading(false));
    };

    const fetchScoreData = () => {
        setLoading(true);
        playerService
            .getScoresByPlayerId(data)
            .then((data) => setScoreData(data))
            .catch(handleError)
            .finally(() => setLoading(false));
    };

    const fetchGameData = () => {
        setLoading(true);
        playerService
            .getGamesByPlayerId(data)
            .then((data) => setGameData(data))
            .catch(handleError)
            .finally(() => setLoading(false));
    };

    const fetchLogData = () => {
        setLoading(true);
        playerService
            .getLogsByPlayerId(data)
            .then((data) => setLogData(data))
            .catch(handleError)
            .finally(() => setLoading(false));
    };

    const handleDelete = (type, id) => {
        if (!window.confirm('Are you sure you want to delete this item?')) return;

        let serviceMethod;

        switch (type) {
            case 'score':
                serviceMethod = playerService.deleteScore;
                break;
            case 'game':
                serviceMethod = playerService.deleteGame;
                break;
            case 'log':
                serviceMethod = playerService.deleteLog;
                break;
            default:
                return;
        }

        serviceMethod(id)
            .then(() => {
                if (type === 'score') fetchScoreData();
                if (type === 'game') fetchGameData();
                if (type === 'log') fetchLogData();
            })
            .catch(handleError);
    };

    const columns = [
        { label: 'Name', key: 'name' },
        { label: 'Created Date', key: 'createdAt' },
        { label: 'Updated Date', key: 'updatedAt' },
    ];

    const scoreColumns = [
        { label: 'Value', key: 'value' },
        { label: 'Date', key: 'createdAt' },
        ...(currentUser?.admin
            ? [{ label: 'Actions', key: 'actions', render: (row) => <button onClick={() => handleDelete('score', row.id)}>Delete</button> }]
            : []),
    ];

    const gameColumns = [
        { label: 'Status', key: 'status', type: 'string' },
        { label: 'Last Played', key: 'updatedAt', type: 'date' },
        ...(currentUser?.admin
            ? [{ label: 'Actions', key: 'actions', render: (row) => <button onClick={() => handleDelete('game', row.id)}>Delete</button> }]
            : []),
    ];

    const logColumns = [
        { label: 'Level', key: 'level' },
        { label: 'Date', key: 'createdAt' },
        ...(currentUser?.admin
            ? [{ label: 'Actions', key: 'actions', render: (row) => <button onClick={() => handleDelete('log', row.id)}>Delete</button> }]
            : []),
    ];

    if (loading) {
        return <Spinner />;
    }

    return (
        <div className="player-container">
            <div className="player">
                {data && <Element data={data} columns={columns} />}
                <br />
                {scoreData && (
                    <Collapsible title={`Scores (${scoreData._embedded?.scores.length || 0})`}>
                        <Table data={scoreData._embedded?.scores} columns={scoreColumns} />
                    </Collapsible>
                )}
                <br />
                {gameData && (
                    <Collapsible title={`Games (${gameData._embedded?.games.length || 0})`}>
                        <Table data={gameData._embedded?.games} columns={gameColumns} />
                    </Collapsible>
                )}
                <br />
                {currentUser?.admin && logData && (
                    <Collapsible title={`Logs (${logData._embedded?.logs.length || 0})`}>
                        <Table data={logData._embedded?.logs} columns={logColumns} />
                    </Collapsible>
                )}
            </div>
        </div>
    );
}

export default Player;
