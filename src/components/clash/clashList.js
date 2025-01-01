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

    const handleAccept = (clash) => {
        clashService.acceptById(clash, currentUser.id).then(clash => {
            navigate(`/clashes/${clash.id}`);
        }).catch(error => {
            handleError(error)
        });
    }

    const handleDecline = (clash) => {
        clashService.declineById(clash, currentUser.id).then(() => {
            window.location.reload();
        }).catch(error => {
            handleError(error)
        });
    }

    const inProgressColumns = [
        { key: 'name', label: 'Name' },
        { key: 'owner', label: 'Created by' },
        {
            key: 'actions',
            label: 'Actions',
            render: () => (
                <button className="continue-button">&#x25B6;</button>
            )
        },
    ];

    const waitingColumns = [
        { label: 'Name', key: 'name' },
        {
            key: 'actions',
            label: 'Actions',
            render: (clash) => (
                clash.owner.id !== currentUser.id ? (<>
                    <button className="accept-button" onClick={(e) => {e.stopPropagation(); handleAccept(clash);}}>&#10004;</button>
                    <button className="decline-button" onClick={(e) => {e.stopPropagation(); handleDecline(clash);}}>&#10060;</button>
                </>) : (
                    <button className="continue-button">&#x25B6;</button>
                )
            ),
        },
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

    const clashes = data?._embedded?.clashes || [];
    const inProgressClashes = clashes.filter((clash) => clash.status === 'IN_PROGRESS');
    const waitingClashes = clashes.filter((clash) => clash.status === 'PENDING');
    const filteredPlayers = activePlayers?.filter((player) => player.id !== currentUser.id);

    if (loading) {
        return <Spinner />;
    }

    return (
        <div className="clash-list-container">
            <div className="clash-list">
            {inProgressClashes?.length > 0 && (<><h3>In Progress</h3><Table data={inProgressClashes} columns={inProgressColumns} paginated={false} displayHeader={false}/><br/></>)}
            {waitingClashes?.length > 0 && (<><h3>Waiting</h3><Table data={waitingClashes} columns={waitingColumns} paginated={false} displayHeader={false}/><br/></>)}
            {filteredPlayers && filteredPlayers.length > 0 ?
                <>
                    <button className="create-button" onClick={createClash} disabled={selectedRows.length === 0}>&#x271A;&nbsp;Create</button>
                    <Table
                        data={filteredPlayers}
                        columns={playerColumns}
                        selectable={true}
                        selectedRows={selectedRows}
                        onRowSelection={toggleRowSelection}
                        paginated={false}
                        displayHeader={false}
                    />
                </>:<div>No players online</div>}
            </div>
        </div>
    );
}

export default ClashList;
