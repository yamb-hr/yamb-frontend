import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LoadingContext } from '../../providers/loadingProvider';
import { ErrorHandlerContext } from '../../providers/errorHandlerProvider';
import { ActivePlayersContext } from '../../providers/activePlayersProvider';
import { AuthenticationContext } from '../../providers/authenticationProvider';
import clashService from '../../services/clashService';
import playerService from '../../services/playerService';
import Table from '../table/table';
import Spinner from '../spinner/spinner';
import PlayerIcon from '../player/playerIcon';
import Collapsible from '../collapsible/collapsible';
import './clash.css';

function ClashList() {

    const navigate = useNavigate();
    const { t } = useTranslation();

    const { isLoading, setLoading } = useContext(LoadingContext);
    const { handleError } = useContext(ErrorHandlerContext);
    const { currentUser } = useContext(AuthenticationContext);
    const { activePlayers } = useContext(ActivePlayersContext);

    const [clashes, setClashes] = useState(null);
    const [clashName, setClashName] = useState(t("my-clash"));
    const [selectedPlayers, setSelectedPlayers] = useState([]);

    const MAX_PLAYERS = 3;    

    useEffect(() => {
        if (!clashes && currentUser) {
            fetchData();
        }
    }, [currentUser]);

    function fetchData() {
        setLoading(true);
        playerService.getClashesByPlayerId(currentUser).then(data => {
            setClashes(data?._embedded?.clashes);
        }).catch(error => {
            handleError(error);
        }).finally(() => {
            setLoading(false);
        });
    };

    function createClash() {
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

    function handleToggleSelect(playerId) {
        setSelectedPlayers((prevSelected) => {
            if (prevSelected.includes(playerId)) {
                return prevSelected.filter((id) => id !== playerId);
            } else if (prevSelected.length < MAX_PLAYERS) {
                return [...prevSelected, playerId];
            }
            return prevSelected;
        });
    };

    const clashColumns = [
        { label: t("name"), key: 'name' },
        { label: t("owner"), key: 'owner' },
    ];

    const inProgressClashes = clashes?.filter((clash) => clash.status === 'IN_PROGRESS');
    const pendingClashes = clashes?.filter((clash) => clash.status === 'PENDING');
    const completedClashes = clashes?.filter((clash) => clash.status === 'COMPLETED');
    const filteredPlayers = activePlayers?.filter((player) => player.id !== currentUser.id);

    if (isLoading) {
        return <Spinner/>
    }

    return (
        <div className="clash-list-container">
            <div className="clash-list">
                {inProgressClashes?.length > 0 && (
                    <Collapsible title={`${t("in-progress")} (${inProgressClashes.length})`} defaultOpen={true}>
                        <Table data={inProgressClashes} columns={clashColumns} paginated={false} displayHeader={false} />
                    </Collapsible>
                )}
                {pendingClashes?.length > 0 && (
                    <Collapsible title={`${t("pending")} (${pendingClashes.length})`} defaultOpen={true}>
                        <Table data={pendingClashes} columns={clashColumns} paginated={false} displayHeader={false} />
                    </Collapsible>
                )}
                {completedClashes?.length > 0 && (
                    <Collapsible title={`${t("completed")} (${completedClashes.length})`} defaultOpen={false}>
                        <Table data={completedClashes} columns={clashColumns} paginated={false} displayHeader={false} />
                    </Collapsible>
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