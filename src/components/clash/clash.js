import React, { useContext, useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { StompClientContext } from '../../providers/stompClientProvider';
import { ErrorHandlerContext } from '../../providers/errorHandlerProvider';
import { ActivePlayersContext } from '../../providers/activePlayersProvider';
import { AuthenticationContext } from '../../providers/authenticationProvider';
import Game from '../game/game';
import Table from '../table/table';
import Element from '../element/element';
import PlayerIcon from '../player/playerIcon';
import clashService from '../../services/clashService';
import './clash.css';

function Clash() {

    const navigate = useNavigate();
    const { t } = useTranslation();

    const { id } = useParams();
    const { handleError } = useContext(ErrorHandlerContext);
    const { currentUser } = useContext(AuthenticationContext);
    const { activePlayers } = useContext(ActivePlayersContext);
    const { stompClient, isConnected } = useContext(StompClientContext);   

    const [clash, setClash] = useState(null); 
    const [reactions, setReactions] = useState([]);
    const [suggestion, setSuggestion] = useState(null);
    const [subscribed, setSubscribed] = useState(false);
    const [playersToAdd, setPlayersToAdd] = useState([]);

    const MAX_PLAYERS = 3;

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
            const subscription = stompClient.subscribe(`/topic/clashes/${id}`, handleClashMessage);
            return () => subscription.unsubscribe();
        }
    }, [id, stompClient, isConnected, subscribed]);

    function handleClashMessage(message) {
        if (message.headers.messageType === "UPDATE") {
            onClashUpdate(message);
        } else if (message.headers.messageType === "REACTION") {
            onReaction(message);
        } else if (message.headers.messageType === "SUGGESTION") {
            onSuggestion(message);
        }
    }

    function handleSendReaction(reaction) {
        if (stompClient && isConnected) {
            try {
                stompClient.publish({
                    destination: `/app/clashes/${id}/reaction`,
                    headers: {},
                    body: reaction
                });
            } catch (error) {
                console.error(error);
            }
        }
    }

    function handleSendSuggestion(suggestion) {
        if (stompClient && isConnected) {
            try {
                stompClient.publish({
                    destination: `/app/clashes/${id}/suggestion`,
                    headers: {},
                    body: suggestion
                });
            } catch (error) {
                console.error(error);
            }
        }
    }

    function onClashUpdate(message) {
		const body = JSON.parse(message.body);
        let updatedClash = body.payload;
        updatedClash._links = clash._links;
        setTimeout(() => {
            console.log("updatedClash", updatedClash);
            setClash(updatedClash);
        }, 1500);
    };

    function onReaction(message) {
        const body = JSON.parse(message.body);
        const sanitizedReaction = DOMPurify.sanitize(body.payload);
    
        const reactionWithId = {
            id: Date.now(),
            reaction: sanitizedReaction,
            left: Math.random() * 60 + 20
        };
    
        setReactions((prevReactions) => [...prevReactions, reactionWithId]);

        setTimeout(() => {
            setReactions((prevReactions) => prevReactions.filter((r) => r.id !== reactionWithId.id));
        }, 3000);
    };

    function onSuggestion(message) {
        const body = JSON.parse(message.body);
        const suggestion = body.payload;

        setSuggestion(suggestion);
    
        setTimeout(() => {
            setSuggestion(null);
        }, 2000);
    };

    function handleDelete() {
        clashService.deleteById(clash).then(data => {
            navigate("/clashes");
        }).catch(error => {
            handleError(error);
        });
    };

    function handleAccept() {
        clashService.acceptById(clash, currentUser.id).then(data => {
            setClash(data);
        }).catch(error => {
            handleError(error);
        });
    };

    function handleDecline() {
        clashService.declineById(clash, currentUser.id).then(data => {
            navigate('/clashes');
        }).catch(error => {
            handleError(error);
        });
    };

    function handleAddPlayers() {
        clashService.addPlayersById(clash, playersToAdd).then(data => {
            setClash(data);
            setPlayersToAdd([])
        }).catch(error => {
            handleError(error);
        });
    };

    function handleRemovePlayer(playerId) {
        clashService.removePlayersById(clash, [playerId]).then(data => {
            setClash(data);
        }).catch(error => {
            handleError(error);
        });
    };

    function togglePlayerToAdd(playerId) {
        setPlayersToAdd((prevSelected) =>
            prevSelected.includes(playerId)
                ? prevSelected.filter((id) => id !== playerId)
                : prevSelected.length + clash.players.length < MAX_PLAYERS
                    ? [...prevSelected, playerId]
                    : prevSelected
        );
    };

    if (clash?.status === 'IN_PROGRESS') {
        return (
            <>
                {reactions && 
                    <div className="reaction-list">
                        {reactions.map(({ id, reaction, left }, index) => (
                            <div 
                                key={id}
                                className="reaction-item"
                                style={{ left: `${left}%` }}
                            >
                                {reaction}
                            </div>
                        ))}
                    </div>
                }
                <Game id={clash?.players[clash?.turn]?.gameId} onSendReaction={handleSendReaction} onSendSuggestion={handleSendSuggestion} suggestion={suggestion} />
            </>
        );
    }

    const clashColumns = [
        { label: t("name"), key: 'name' },
        { label: t("created-at"), key: 'createdAt' }
    ];

    const playerColumns = [
        { label: t("place"), key: 'place' },
        { label: t("name"), key: 'name' },
        { label: t("score"), key: 'score' }
    ]

    const filteredActivePlayers = activePlayers?.filter(player => !clash?.players?.some(clashPlayer => clashPlayer.id === player.id));

    return (
        <div className="clash-container">
            <div className="clash">
                {clash && (
                    <div>
                        <br/>
                        <Element data={clash} columns={clashColumns} />
                        <br/>
                        <div className="player-actions">
                            {clash.owner.id === currentUser.id && clash.status === "PENDING" && (
                                <div>
                                    <button className="delete-button" onClick={handleDelete}>
                                        <span className="icon">&#10060;</span>&nbsp;{t("delete")}
                                    </button>
                                </div>
                            )}
                            {clash.players.find(player => player.id === currentUser.id)?.status === "PENDING" && (
                                <div>
                                    <button className="accept-button" onClick={handleAccept}>
                                        <span className="icon">&#10004;</span>&nbsp;{t("accept")}
                                    </button>
                                    <button className="decline-button" onClick={handleDecline}>
                                        <span className="icon">&#10060;</span>&nbsp;{t("decline")}
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="active-players-container">
                            {clash.players.map(player => (
                                <div key={player.id}>
                                    <div className="player-icon-wrapper">
                                        {clash.status === "PENDING" && player.id !== currentUser.id && player.status !== "ACCEPTED" && clash.players.length > 2 && clash.owner.id === currentUser.id && <button className="remove-button-single" onClick={() => handleRemovePlayer(player.id)}>
                                            <span className="icon">&#10060;</span>
                                        </button>}
                                        {clash.status === "COMPLETED" && clash.winner?.id === player.id && <div className="crown-badge" >
                                            <span className="icon">&#128081;</span>
                                        </div>}
                                        <PlayerIcon key={player.id} player={player} selectable={false} offline={!activePlayers.find((activePlayer) => activePlayer.id === player.id)} />
                                    </div>
                                </div>
                            ))}
                        </div>
                        {clash.status === "PENDING" && clash.owner.id === currentUser.id && (
                            <div>
                                {clash.owner.id === currentUser.id && (
                                    <button
                                        onClick={handleAddPlayers}
                                        className="add-button"
                                        disabled={playersToAdd.length <= 0 || clash.players.length >= MAX_PLAYERS}
                                    >
                                        {t("add-to-clash")}
                                    </button>
                                )}
                                <h3>
                                    {t("selected-players")}:&nbsp;{clash.players.length + playersToAdd.length}/{MAX_PLAYERS}
                                </h3>
                                <div className="active-players-container">
                                    {filteredActivePlayers.map((player) => (
                                        <PlayerIcon
                                            key={player.id}
                                            player={player}
                                            selectable={true}
                                            selected={playersToAdd.includes(player.id)}
                                            onToggleSelect={() => togglePlayerToAdd(player.id)}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                        {clash.status === "COMPLETED" && (
                            <div>
                                {(() => {
                                    const sortedPlayers = [...clash.players].sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

                                    const completedPlayers = sortedPlayers.map((player, index) => ({
                                        ...player,
                                        place: index + 1
                                    }));

                                    return <Table data={completedPlayers} columns={playerColumns} displayHeader={false} paginated={false} />;
                                })()}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
    
}

export default Clash;
