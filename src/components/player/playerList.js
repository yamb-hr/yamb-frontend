import React from 'react';
import { useTranslation } from 'react-i18next';
import playerService from '../../services/playerService';
import Table from '../table/table';
import './player.css';

function PlayerList() {

    const { t } = useTranslation();

    const columns = [
        { label: t("name"), key: 'name', type: 'string' },
        { label: t("created-at"), key: 'createdAt', type: 'date' }
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