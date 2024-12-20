import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CurrentUserContext } from '../../providers/currentUserProvider';
import { ErrorHandlerContext } from '../../providers/errorHandlerProvider';
import { StompClientContext } from '../../providers/stompClientProvider';
import playerService from '../../services/playerService';
import clashService from '../../services/clashService';
import Spinner from '../spinner/spinner';
import Table from '../table/table';
import './clash.css';

function ClashList() {
    
    const navigate = useNavigate();

    const { currentUser } = useContext(CurrentUserContext);
    const { handleError } = useContext(ErrorHandlerContext);
    const { stompClient, isConnected } = useContext(StompClientContext);

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedRows, setSelectedRows] = useState([]);
	const [activePlayers, setActivePlayers] = useState([]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const fetchedData = await playerService.getClashesByPlayerId(currentUser);
            setData(fetchedData);
        } catch (error) {
            handleError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!data && currentUser) {
            fetchData();
        }
    }, [currentUser]);

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

    const createClash = async () => {
        if (selectedRows.length === 0) return;
        const players = [...selectedRows, currentUser.id];
        clashService.create(currentUser.id, players, "LIVE").then(data => {
            navigate('/clashes/' + data.id);
        }).catch(error => {
            handleError(error);
        }).finally(() => {
            setSelectedRows([]);
        });
    };

    const columns = [
        { label: 'Name', key: 'name' },
        { label: 'Owner', key: 'owner' },
        { label: 'Last Played', key: 'updatedAt' }
    ];

    const playerColumns = [
        { label: 'Name', key: 'name' }
    ];

    const toggleRowSelection = (rowId) => {
        setSelectedRows((prevSelected) => {
            if (prevSelected.includes(rowId)) {
                return prevSelected.filter((id) => id !== rowId);
            } else {
                return [...prevSelected, rowId];
            }
        });
    };

    const filteredPlayers = activePlayers?.filter((player) => player.id !== currentUser.id);

    if (loading) {
        return <Spinner />;
    }

    return (
        <div className="clash-list-container">
            <div className="clash-list">
                <h4>Ongoing Clashes</h4>
                {data && <Table data={data._embedded?.clashes} columns={columns} paginated={false}></Table>}
                <br />
                {filteredPlayers && filteredPlayers.length > 0 ?
                    <>
                        <h4>Online Players</h4>
                        <button
                            className="create-clash-button"
                            onClick={createClash}
                            disabled={selectedRows.length === 0}
                        >
                            Create
                        </button>
                        <Table
                            data={filteredPlayers}
                            columns={playerColumns}
                            selectable={true}
                            selectedRows={selectedRows}
                            onRowSelection={toggleRowSelection}
                            paginated={false}
                        />
                    </>:<div>No players online</div>}
            </div>
        </div>
    );
}

export default ClashList;
