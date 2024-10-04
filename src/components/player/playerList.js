import React from 'react';
import playerService from '../../services/playerService';
import Table from '../table/table';
import './player.css';

function PlayerList() {

    const columns = [
        { label: 'Id', key: 'id' },
        { label: 'Name', key: 'name' },
        { label: 'Created Date', key: 'createdAt' }
    ];

    return (
        <div className="player-list-container">
            <div className="player-list">
                <Table service={playerService} columns={columns}></Table>
            </div>
        </div>
    );
};

export default PlayerList;