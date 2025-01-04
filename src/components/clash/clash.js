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
import PlayerIcon from '../player/playerIcon';

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
            setPlayersToAdd([])
        }).catch(error => {
            handleError(error);
        });
    };

    // const handleRemovePlayers = () => {
    //     clashService.removePlayersById(clash, playersToRemove).then(data => {
    //         setClash(data);
    //     }).catch(error => {
    //         handleError(error);
    //     });
    // };

    const handleRemovePlayer = (playerId) => {
        clashService.removePlayersById(clash, [playerId]).then(data => {
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

    // const togglePlayerToRemove = (playerId) => {
    //     setPlayersToRemove((prevSelected) =>
    //         prevSelected.includes(playerId)
    //             ? prevSelected.filter((id) => id !== playerId)
    //             : [...prevSelected, playerId]
    //     );
    // };

    if (clash?.status === 'IN_PROGRESS') {
        return (
            <Game id={clash?.players[clash?.turn]?.gameId}/>
        );
    }

    const clashColumns = [
        { label: 'Name', key: 'name' },
        { label: 'Owner', key: 'owner.name' },
        { label: 'Created At', key: 'createdAt' },
    ];

    const filteredActivePlayers = activePlayers?.filter(player => !clash?.players?.some(clashPlayer => clashPlayer.id === player.id));

    return (
        <div className="clash-container">
            <div className="clash">
                {clash && (
                    <>
                    <br/>
                    <Element data={clash} columns={clashColumns} />
                    <br/>
                    <div className="player-actions">
                        {clash.owner.id === currentUser.id && (
                            <>
                                <button className="delete-button" onClick={handleAccept}>
                                    <span className="icon">&#10060;</span>&nbsp;Delete
                                </button>
                            </>
                        )}
                        {clash.players.find(player => player.id === currentUser.id)?.status === "PENDING" && (
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
                    <div className="active-players-container">
                        {clash.players.map(player => (
                            <div key={player.id}>
                                <div className="player-icon-wrapper">
                                    {player.id !== currentUser.id && player.status !== "ACCEPTED" && clash.players.length > 2 && <button className="remove-button-single" onClick={() => handleRemovePlayer(player.id)}>
                                        <span className="icon">&#10060;</span>
                                    </button>}
                                    {player.status === "ACCEPTED" && <div className="accepted-badge" >
                                        <span className="icon">&#10004;</span>
                                    </div>}
                                    <PlayerIcon key={player.id} player={player} selectable={false} />
                                </div>
                            </div>
                        ))}
                    </div>
                    {clash.owner.id === currentUser.id && <button onClick={handleAddPlayers} className="add-button" disabled={playersToAdd.length <= 0}>
                        Add to Clash
                    </button>}
                    <h3>Selected players: {playersToAdd.length}</h3>
                    <div className="active-players-container">
                        {filteredActivePlayers.map(player => (
                            <PlayerIcon key={player.id} player={player} selectable={true} selected={playersToAdd.includes(player.id)} onToggleSelect={() => togglePlayerToAdd(player.id)} />
                        ))}
                    </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default Clash;
