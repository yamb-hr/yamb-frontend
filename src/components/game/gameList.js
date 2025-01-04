import React from 'react';
import { useTranslation } from 'react-i18next';
import gameService from '../../services/gameService';
import Table from '../table/table';
import './game.css';

function GameList() {

    const { t } = useTranslation();

    const columns = [
        { label: t("player"), key: 'player', type: 'string' },
        { label: t("last-played"), key: 'updatedAt', type: 'date' }
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