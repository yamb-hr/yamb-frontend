import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CurrentUserContext } from '../../providers/currentUserProvider';
import { StompClientContext } from '../../providers/stompClientProvider';
import { ErrorHandlerContext } from '../../providers/errorHandlerProvider';
import clashService from '../../services/clashService';
import playerService from '../../services/playerService';
import Spinner from '../spinner/spinner';
import Table from '../table/table';
import Game from '../game/game';
import './clash.css';

function Clash() {
    const { id } = useParams();
    const { currentUser } = useContext(CurrentUserContext);
    const { handleError } = useContext(ErrorHandlerContext);
        const { stompClient, isConnected } = useContext(StompClientContext);

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activePlayers, setActivePlayers] = useState([]);
    const [selectedPlayers, setSelectedPlayers] = useState([]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const clashData = await clashService.getById(id);
            setData(clashData);
        } catch (error) {
            handleError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id && !data) {
            fetchData();
        }
    }, [id]);

    useEffect(() => {
        if (currentUser && stompClient && isConnected) {
            const subscription = stompClient.subscribe('/topic/players', onPlayerStatusChanged);
            playerService.getAllActive().then(data => {
                setActivePlayers(data._embedded.players);
            }).catch(error => {
                handleError(error);
            });
            return () => {
                subscription.unsubscribe();
            };
        }
    }, [currentUser, stompClient, isConnected]);

    const onPlayerStatusChanged = (message) => {
        console.log(message);
		let body = JSON.parse(message.body);
		setActivePlayers(JSON.parse(atob(body.payload)).content);
	}

    const handleAccept = async () => {
        try {
            await clashService.acceptById(id, currentUser.id);
            fetchData();
        } catch (error) {
            handleError(error);
        }
    };

    const handleDecline = async () => {
        try {
            await clashService.declineById(id, currentUser.id);
            fetchData();
        } catch (error) {
            handleError(error);
        }
    };

    const handleAddPlayers = async () => {
        try {
            await clashService.addPlayers(id, selectedPlayers);
            fetchData();
        } catch (error) {
            handleError(error);
        }
    };

    const handleRemovePlayer = async (playerId) => {
        try {
            await clashService.removePlayer(id, playerId);
            fetchData();
        } catch (error) {
            handleError(error);
        }
    };

    const togglePlayerSelection = (playerId) => {
        setSelectedPlayers((prevSelected) =>
            prevSelected.includes(playerId)
                ? prevSelected.filter((id) => id !== playerId)
                : [...prevSelected, playerId]
        );
    };

    if (loading) {
        return <Spinner />;
    }

    if (data?.status === 'IN_PROGRESS') {
        return (
            <Game id={data.players[data.turn].gameId} onFill={fetchData} />
        );
    }

    const clashColumns = [
        { label: 'Owner', key: 'owner.name' },
        { label: 'Created At', key: 'createdAt' },
    ];

    const playerColumns = [
        { label: 'Player', key: 'name' },
        {
            key: 'actions',
            label: 'Actions',
            render: (player) =>
                data.owner.id === currentUser.id ? (
                    <button className="remove-button" onClick={(e) => {e.stopPropagation(); handleRemovePlayer(player.id);}}>&#10060;</button>
                ) : null,
        },
    ];

    const onlinePlayerColumns = [
        { label: 'Name', key: 'name' },
    ];

    const filteredPlayers = data.players?.filter((player) => player.id !== currentUser.id);
    const acceptedPlayers = filteredPlayers.filter((player) => player.status === 'ACCEPTED');
    const pendingPlayers = filteredPlayers.filter((player) => player.status === 'PENDING');

    return (
        <div className="clash-container">
            <div className="clash">
                <Table data={[data]} columns={clashColumns} paginated={false} displayHeader={false} />
                <br/>
                <Table data={acceptedPlayers} columns={playerColumns} paginated={false} displayHeader={false} />
                Waiting on...
                <Table data={pendingPlayers} columns={playerColumns} paginated={false} displayHeader={false} />
                <br/>
                {data.owner.id === currentUser.id ? (
                    <>
                        <button className="add-button" onClick={handleAddPlayers} disabled={selectedPlayers.length === 0}>&#x271A;&nbsp;Add</button>
                        <Table
                            data={activePlayers}
                            columns={onlinePlayerColumns}
                            selectable={true}
                            selectedRows={selectedPlayers}
                            onRowSelection={togglePlayerSelection}
                            paginated={false}
                            displayHeader={false}
                        />
                    </>
                ) : (
                    <div className="player-actions">
                        <h4>Actions</h4>
                        {data.players.find((p) => p.id === currentUser.id)?.status === 'PENDING' && (
                            <>
                                <button className="accept-button" onClick={handleAccept}>
                                    &#10004; Accept
                                </button>
                                <button className="decline-button" onClick={handleDecline}>
                                    &#10060; Decline
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Clash;
