import React from 'react';
import gameService from '../../services/gameService';
import Table from '../table/table';
import './game.css';

function GameList() {

    const columns = [
        { label: 'Player', key: 'player', type: 'string' },
        { label: 'Last Played', key: 'updatedAt', type: 'date' }
    ];

    const progress = { key: 'progress' }

    return (
        <div className="game-list-container">
            <div className="game-list">
                <Table service={gameService} columns={columns} progress={progress}></Table>
            </div>
        </div>
    );
};

export default GameList;