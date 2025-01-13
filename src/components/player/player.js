import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ErrorHandlerContext } from '../../providers/errorHandlerProvider';
import { CurrentUserContext } from '../../providers/currentUserProvider';
import playerService from '../../services/playerService';
import Collapsible from '../collapsible/collapsible';
import Element from '../element/element';
import Spinner from '../spinner/spinner';
import Table from '../table/table';
import './player.css';

function Player() {
    
    const { id } = useParams();
    const { t } = useTranslation();
    
    const { handleError } = useContext(ErrorHandlerContext);
    const { currentUser } = useContext(CurrentUserContext);

    const [data, setData] = useState(null);
    const [scoreData, setScoreData] = useState(null);
    const [gameData, setGameData] = useState(null);
    const [clashData, setClashData] = useState(null);
    const [logData, setLogData] = useState(null);
    const [loading, setLoading] = useState(true);

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
            if(id && data && !clashData) {
                fetchClashData();
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

    const fetchClashData = () => {
        setLoading(true);
        playerService
            .getClashesByPlayerId(data)
            .then((data) => setClashData(data))
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

        // let serviceMethod;

        // switch (type) {
        //     case 'score':
        //         serviceMethod = playerService.deleteById;
        //         break;
        //     case 'game':
        //         serviceMethod = gameService.deleteById;
        //         break;
        //     case 'game':
        //         serviceMethod = clashService.deleteById;
        //         break;
        //     case 'log':
        //         serviceMethod = logService.deleteById;
        //         break;
        //     default:
        //         return;
        // }

        // serviceMethod(id).then(() => {
        //         if (type === 'score') fetchScoreData();
        //         if (type === 'game') fetchGameData();
        //         if (type === 'log') fetchLogData();
        // }).catch(handleError);
    };

    const columns = [
        { label: t("name"), key: 'name' },
        { label: t("created-at"), key: 'createdAt' },
        { label: t("updated-at"), key: 'updatedAt' },
    ];

    const scoreColumns = [
        { label: t("value"), key: 'value' },
        { label: t("date"), key: 'createdAt' },
        ...(currentUser?.admin
            ? [{ label: t("actions"), key: 'actions', render: (row) => <button className="delete-button" onClick={() => handleDelete('score', row.id)}>Delete</button> }]
            : []),
    ];

    const gameColumns = [
        { label: t("status"), key: 'status', type: 'string' },
        { label: t("last-played"), key: 'updatedAt', type: 'date' },
        ...(currentUser?.admin
            ? [{ label: t("actions"), key: 'actions', render: (row) => <button className="delete-button" onClick={() => handleDelete('game', row.id)}>Delete</button> }]
            : []),
    ];

    const clashColumns = [
        { label: t("name"), key: 'name', type: 'string' },
        { label: t("last-played"), key: 'updatedAt', type: 'date' },
        ...(currentUser?.admin
            ? [{ label: t("actions"), key: 'actions', render: (row) => <button className="delete-button" onClick={() => handleDelete('clash', row.id)}>Delete</button> }]
            : []),
    ];

    const logColumns = [
        { label: t("level"), key: 'level' },
        { label: t("date"), key: 'createdAt' },
        ...(currentUser?.admin
            ? [{ label: t("actions"), key: 'actions', render: (row) => <button className="delete-button" onClick={() => handleDelete('log', row.id)}>Delete</button> }]
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
                    <Collapsible title={`${t('scores')} (${scoreData._embedded?.scores.length || 0})`}>
                        <Table data={scoreData._embedded?.scores} columns={scoreColumns} />
                    </Collapsible>
                )}
                <br />
                {currentUser?.admin && gameData && (
                    <Collapsible title={`${t('games')} (${gameData._embedded?.games.length || 0})`}>
                        <Table data={gameData._embedded?.games} columns={gameColumns} />
                    </Collapsible>
                )}
                <br />
                {currentUser?.admin && clashData && (
                    <Collapsible title={`${t('clashes')} (${clashData._embedded?.clashes.length || 0})`}>
                        <Table data={gameData._embedded?.clashes} columns={clashColumns} />
                    </Collapsible>
                )}
                <br />
                {currentUser?.admin && logData && (
                    <Collapsible title={`${t('logs')} (${logData._embedded?.logs.length || 0})`}>
                        <Table data={logData._embedded?.logs} columns={logColumns} />
                    </Collapsible>
                )}
            </div>
        </div>
    );
}

export default Player;
