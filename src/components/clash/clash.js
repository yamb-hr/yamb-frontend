import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CurrentUserContext } from '../../providers/currentUserProvider';
import { StompClientContext } from '../../providers/stompClientProvider';
import { ErrorHandlerContext } from '../../providers/errorHandlerProvider';
import { ActivePlayersContext } from '../../providers/activePlayersProvider';
import clashService from '../../services/clashService';
import PlayerIcon from '../player/playerIcon';
import Element from '../element/element';
import Table from '../table/table';
import Game from '../game/game';
import './clash.css';

function Clash() {

    const navigate = useNavigate();
    const { t } = useTranslation();

    const { id } = useParams();
    const { currentUser } = useContext(CurrentUserContext);
    const { handleError } = useContext(ErrorHandlerContext);
    const { activePlayers } = useContext(ActivePlayersContext);
    const { stompClient, isConnected } = useContext(StompClientContext);

    const [clash, setClash] = useState(null);
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
            const subscription = stompClient.subscribe(`/topic/clashes/${id}`, onClashUpdate);
            return () => subscription.unsubscribe();
        }
    }, [id, stompClient, isConnected, subscribed]);

    const onClashUpdate = (message) => {
		const body = JSON.parse(message.body);
        let updatedClash = body.payload;
        updatedClash._links = clash._links;
        setTimeout(() => {
            console.log("updatedClash", updatedClash);
            setClash(updatedClash);
        }, 1500);
    };

    const handleDelete = async () => {
        clashService.deleteById(clash).then(data => {
            navigate("/clashes");
        }).catch(error => {
            handleError(error);
        });
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
                : prevSelected.length + clash.players.length < MAX_PLAYERS
                    ? [...prevSelected, playerId]
                    : prevSelected
        );
    };

    if (clash?.status === 'IN_PROGRESS') {
        return (
            <Game id={clash?.players[clash?.turn]?.gameId}/>
        );
    }

    const clashColumns = [
        { label: t("name"), key: 'name' },
        { label: t("owner"), key: 'owner.name' },
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
                    <>
                        <br/>
                        <Element data={clash} columns={clashColumns} />
                        <br/>
                        <div className="player-actions">
                            {clash.owner.id === currentUser.id && clash.status === "PENDING" && (
                                <>
                                    <button className="delete-button" onClick={handleDelete}>
                                        <span className="icon">&#10060;</span>&nbsp;{t("delete")}
                                    </button>
                                </>
                            )}
                            {clash.players.find(player => player.id === currentUser.id)?.status === "PENDING" && (
                                <>
                                    <button className="accept-button" onClick={handleAccept}>
                                        <span className="icon">&#10004;</span>&nbsp;{t("accept")}
                                    </button>
                                    <button className="decline-button" onClick={handleDecline}>
                                        <span className="icon">&#10060;</span>&nbsp;{t("decline")}
                                    </button>
                                </>
                            )}
                        </div>
                        <div className="active-players-container">
                            {clash.players.map(player => (
                                <div key={player.id}>
                                    <div className="player-icon-wrapper">
                                        {clash.status === "PENDING" && player.id !== currentUser.id && player.status !== "ACCEPTED" && clash.players.length > 2 && clash.owner.id === currentUser.id && <button className="remove-button-single" onClick={() => handleRemovePlayer(player.id)}>
                                            <span className="icon">&#10060;</span>
                                        </button>}
                                        {clash.status === "PENDING" && player.status === "ACCEPTED" && <div className="accepted-badge" >
                                            <span className="icon">&#10004;</span>
                                        </div>}
                                        {clash.status === "COMPLETED" && clash.winner?.id === player.id && <div className="crown-badge" >
                                            <span className="icon">&#128081;</span>
                                        </div>}
                                        <PlayerIcon key={player.id} player={player} selectable={false} offline={!activePlayers.find((activePlayer) => activePlayer.id === player.id)} />
                                    </div>
                                </div>
                            ))}
                        </div>
                        {clash.status === "PENDING" && clash.owner.id === currentUser.id && (
                            <>
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
                            </>
                        )}
                        {clash.status === "COMPLETED" && (
                            <>
                                {(() => {
                                    const sortedPlayers = [...clash.players].sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

                                    const completedPlayers = sortedPlayers.map((player, index) => ({
                                        ...player,
                                        place: index + 1
                                    }));

                                    return <Table data={completedPlayers} columns={playerColumns} displayHeader={false} paginated={false} />;
                                })()}
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default Clash;
