import React from 'react';
import { useTranslation } from 'react-i18next';
import scoreService from '../../services/scoreService';
import Table from '../table/table';
import './score.css';

function ScoreList() {

    const { t } = useTranslation();

    const columns = [
        { label: t("player"), key: 'player', type: 'string' },
        { label: t("score"), key: 'value', type: 'number' },
        { label: t("date"), key: 'createdAt', type: 'date' }
    ];

    return (
        <div className="score-list-container">
            <div className="score-list">
                <Table service={scoreService} columns={columns}></Table>
            </div>
        </div>
    );
};

export default ScoreList;