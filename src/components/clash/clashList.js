import React, { useContext, useEffect, useState } from 'react';
import { CurrentUserContext } from '../../providers/currentUserProvider';
import { ErrorContext } from '../../providers/errorProvider';
import playerService from '../../services/playerService';
import Table from '../table/table';
import './clash.css';

function ClashList() {
    
    const [ data, setData ] = useState(null);
    const { currentUser } = useContext(CurrentUserContext);
    const { handleError } = useContext(ErrorContext);

    const fetchData = async () => {
        playerService.getClashesByPlayerId(currentUser).then(data => {
            setData(data);
        })
        .catch(error => {
            handleError(error);
        })
        .finally(() => {
        })
    };

    useEffect(() => {
        if (!data && currentUser) {
            fetchData();
        }
    }, [currentUser]);

    const columns = [
        { label: 'Owner', key: 'owner' },
        { label: 'Turn', key: 'currentPlayer' },
        { label: 'Winner', key: 'winner' },
        { label: 'Status', key: 'status' },
        { label: 'Type', key: 'type' },
        { label: 'Started', key: 'createdAt' }
    ];

    return (
        <div className="clash-list">
            {data && <Table data={data._embedded?.clashes} columns={columns}></Table>}
        </div>
    );
};

export default ClashList;