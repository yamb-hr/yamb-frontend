import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CurrentUserContext } from '../../providers/currentUserProvider';
import { ErrorHandlerContext } from '../../providers/errorHandlerProvider';
import { ActivePlayersContext } from '../../providers/activePlayersProvider'
import playerService from '../../services/playerService';
import clashService from '../../services/clashService';
import PlayerIcon from '../player/playerIcon';
import Spinner from '../spinner/spinner';
import Table from '../table/table';
import './clash.css';

function ClashList() {

    const navigate = useNavigate();
    const { t } = useTranslation();

    const { currentUser } = useContext(CurrentUserContext);
    const { handleError } = useContext(ErrorHandlerContext);
    const { activePlayers } = useContext(ActivePlayersContext);

    const [clashes, setClashes] = useState(null);
    const [loading, setLoading] = useState(true);
    const [clashName, setClashName] = useState(t("my-clash"));
    const [selectedPlayers, setSelectedPlayers] = useState([]);

    const MAX_PLAYERS = 3;

    const fetchData = async () => {
        setLoading(true);
        playerService.getClashesByPlayerId(currentUser).then(data => {
            setClashes(data?._embedded?.clashes);
        }).catch(error => {
            handleError(error);
        }).finally(() => {
            setLoading(false);
        });
    };

    useEffect(() => {
        if (!clashes && currentUser) {
            fetchData();
        }
    }, [currentUser]);

    const createClash = () => {
        if (selectedPlayers.length === 0 || !clashName.trim()) return;
        const players = [...selectedPlayers, currentUser.id];
        clashService.create(currentUser.id, players, "LIVE", clashName.trim()).then(data => {
            navigate('/clashes/' + data.id);
        }).catch(error => {
            handleError(error);
        }).finally(() => {
            setSelectedPlayers([]);
            setClashName('');
        });
    };

    const handleToggleSelect = (playerId) => {
        setSelectedPlayers((prevSelected) => {
            if (prevSelected.includes(playerId)) {
                return prevSelected.filter((id) => id !== playerId);
            } else if (prevSelected.length < MAX_PLAYERS) {
                return [...prevSelected, playerId];
            }
            return prevSelected;
        });
    };

    const inProgressColumns = [
        { key: t("name"), label: 'name' },
        { label: t("owner"), key: 'owner' },
    ];

    const waitingColumns = [
        { label: t("name"), key: 'name' },
        { label: t("owner"), key: 'owner' },
    ];

    const inProgressClashes = clashes?.filter((clash) => clash.status === 'IN_PROGRESS');
    const waitingClashes = clashes?.filter((clash) => clash.status === 'PENDING');
    const filteredPlayers = activePlayers?.filter((player) => player.id !== currentUser.id);

    if (loading) {
        return <Spinner />;
    }

    return (
        <div className="clash-list-container">
            <div className="clash-list">
                {inProgressClashes?.length > 0 && (
                    <>
                        <h3>{t("in-progress")}</h3>
                        <Table data={inProgressClashes} columns={inProgressColumns} paginated={false} displayHeader={false} />
                        <br />
                    </>
                )}
                {waitingClashes?.length > 0 && (
                    <>
                        <h3>{t("pending")}</h3>
                        <Table data={waitingClashes} columns={waitingColumns} paginated={false} displayHeader={false} />
                        <br />
                    </>
                )}
                <div className="create-clash-container">
                    <input
                        type="text"
                        value={clashName}
                        onChange={(e) => setClashName(e.target.value)}
                        placeholder={t("enter-name")}
                        className="clash-name-input"
                    />
                    <button onClick={createClash} className="create-clash-button" disabled={selectedPlayers.length <= 0 || !clashName}>
                        {t("create-clash")}
                    </button>
                    <h3>{t("selected-players")}: {selectedPlayers.length}/{MAX_PLAYERS}</h3>
                    <div className="active-players-container">
                        {filteredPlayers.map(player => (
                            <PlayerIcon key={player.id} player={player} selectable={true} selected={selectedPlayers.includes(player.id)} onToggleSelect={() => handleToggleSelect(player.id)} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ClashList;