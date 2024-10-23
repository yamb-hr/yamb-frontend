import React from 'react';
import gameService from '../../services/gameService';
import Table from '../table/table';
import './game.css';

function GameList() {

    const columns = [
        { label: 'Player', key: 'player', type: 'string' },
        { label: 'Status', key: 'status', type: 'string' },
        { label: 'Created Date', key: 'createdAt', type: 'date' }
    ];

    return (
        <div className="game-list-container">
            <div className="game-list">
                <Table service={gameService} columns={columns}></Table>
            </div>
        </div>
    );
};

export default GameList;