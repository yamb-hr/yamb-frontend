import React from 'react';
import gameService from '../../services/gameService';
import Table from '../table/table';
import './game.css';

function GameList() {

    const columns = [
        { label: 'Player', key: 'player' },
        { label: 'Status', key: 'status' },
        { label: 'Created Date', key: 'createdAt' }
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