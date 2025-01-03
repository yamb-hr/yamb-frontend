import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CurrentUserContext } from '../../providers/currentUserProvider';
import { StompClientContext } from '../../providers/stompClientProvider';
import { ErrorHandlerContext } from '../../providers/errorHandlerProvider';
import { ActivePlayersContext } from '../../providers/activePlayersProvider';
import clashService from '../../services/clashService';
import Element from '../element/element';
import Table from '../table/table';
import Game from '../game/game';
import './clash.css';

function Clash() {

    const { id } = useParams();
    const { currentUser } = useContext(CurrentUserContext);
    const { handleError } = useContext(ErrorHandlerContext);
    const { activePlayers } = useContext(ActivePlayersContext);
    const { stompClient, isConnected } = useContext(StompClientContext);

    const [clash, setClash] = useState(null);
    const [subscribed, setSubscribed] = useState(false);
    const [playersToAdd, setPlayersToAdd] = useState([]);
    const [playersToRemove, setPlayersToRemove] = useState([]);

    useEffect(() => {
		if (!clash && id) {
			clashService.getById(id).then(data => {
                setClash(data);
                setSubscribed(true);
            }).catch(error => {
                handleError(error);
            });
		}
	}, [currentUser, id]);

    useEffect(() => {
        if (id && stompClient && isConnected && subscribed) {
            const subscription = stompClient.subscribe(`/topic/clashes/${id}`, onClashUpdate);
            return () => subscription.unsubscribe();
        }
    }, [id, stompClient, isConnected, subscribed]);

    const onClashUpdate = (message) => {
		const body = JSON.parse(message.body);
        const updatedClash = JSON.parse(atob(body.payload));
        setTimeout(() => {
            console.log("updatedClash", updatedClash);
            setClash(updatedClash);
        }, 1500);
    };

    const handleAccept = async () => {
        clashService.acceptById(clash, currentUser.id).then(data => {
            setClash(data);
        }).catch(error => {
            handleError(error);
        });
    };

    const handleDecline = async () => {
        clashService.declineById(clash, currentUser.id).then(data => {
            setClash(data);
        }).catch(error => {
            handleError(error);
        });
    };

    const handleAddPlayers = () => {
        clashService.addPlayersById(clash, playersToAdd).then(data => {
            setClash(data);
        }).catch(error => {
            handleError(error);
        });
    };

    const handleRemovePlayers = () => {
        clashService.removePlayersById(clash, playersToRemove).then(data => {
            setClash(data);
        }).catch(error => {
            handleError(error);
        });
    };

    const togglePlayerToAdd = (playerId) => {
        setPlayersToAdd((prevSelected) =>
            prevSelected.includes(playerId)
                ? prevSelected.filter((id) => id !== playerId)
                : [...prevSelected, playerId]
        );
    };

    const togglePlayerToRemove = (playerId) => {
        setPlayersToRemove((prevSelected) =>
            prevSelected.includes(playerId)
                ? prevSelected.filter((id) => id !== playerId)
                : [...prevSelected, playerId]
        );
    };

    if (clash?.status === 'IN_PROGRESS') {
        return (
            <Game id={clash?.players[clash?.turn]?.gameId}/>
        );
    }

    const clashColumns = [
        { label: 'Owner', key: 'owner.name' },
        { label: 'Created At', key: 'createdAt' },
    ];

    const playerColumns = [
        { label: 'Player', key: 'name' }
        // {
        //     key: 'actions',
        //     label: 'Actions',
        //     render: (player) =>
        //         data.owner.id === currentUser.id ? (
        //             <button className="remove-button" onClick={(e) => {e.stopPropagation(); handleRemovePlayer(player.id);}}>&#10060;</button>
        //         ) : null,
        // },
    ];

    const onlinePlayerColumns = [
        { label: 'Name', key: 'name' },
    ];

    const players = clash?.players || [];
    const filteredPlayers = activePlayers?.filter((player) => player.id !== currentUser.id);
    const acceptedPlayers = players?.filter((player) => player.status === 'ACCEPTED');
    const pendingPlayers = players?.filter((player) => player.status === 'PENDING');

    return (
        <div className="clash-container">
            <div className="clash">
                {clash && (<><br/><Element data={clash} columns={clashColumns} /><br/></>)}
                {/* {clash?.owner?.id !== currentUser?.id && clash?.players?.find(p => p.id === currentUser?.id)?.status === 'PENDING' && (
                    <>
                        <div className="player-actions">
                            {players.find((p) => p.id === currentUser.id)?.status === 'PENDING' && (
                                <>
                                    <button className="accept-button" onClick={handleAccept}>
                                        <span className="icon">&#10004;</span>&nbsp;Accept
                                    </button>
                                    <button className="decline-button" onClick={handleDecline}>
                                        <span className="icon">&#10060;</span>&nbsp;Decline
                                    </button>
                                </>
                            )}
                        </div>
                    </>
                )}
                {acceptedPlayers?.length > 0 && (
                    <>
                        <h3>Accepted</h3>
                        <Table 
                            data={acceptedPlayers} 
                            columns={playerColumns}
                            paginated={false} 
                            displayHeader={false}
                        />
                        <br/>
                    </>
                )}
                {pendingPlayers?.length > 0 && (
                    <>
                        <h3>Waiting on...</h3>
                        {clash?.owner?.id === currentUser?.id && <button className="remove-button" onClick={handleRemovePlayers} disabled={playersToRemove?.length === 0}><span className="icon">&#10060;</span>&nbsp;Remove</button>}
                        <Table 
                            data={pendingPlayers} 
                            columns={playerColumns} 
                            paginated={false} 
                            displayHeader={false} 
                            selectable={true} 
                            selectedRows={playersToRemove}
                            onRowSelection={togglePlayerToRemove}
                        />
                        <br/>
                    </>
                )}
                {clash?.owner?.id === currentUser.id && (
                    <>
                        <button className="add-button" onClick={handleAddPlayers} disabled={playersToAdd?.length === 0}><span className="icon">&#x271A;</span>&nbsp;Add</button>
                        <Table
                            data={filteredPlayers}
                            columns={onlinePlayerColumns}
                            selectable={true}
                            selectedRows={playersToAdd}
                            onRowSelection={togglePlayerToAdd}
                            paginated={false}
                            displayHeader={false}
                        />
                    </>
                )} */}
            </div>
        </div>
    );
}

export default Clash;
