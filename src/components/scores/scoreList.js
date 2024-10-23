import React from 'react';
import scoreService from '../../services/scoreService';
import Table from '../table/table';
import './score.css';

function ScoreList() {

    const columns = [
        { label: 'Player', key: 'player', type: 'string' },
        { label: 'Score', key: 'value', type: 'number' },
        { label: 'Created Date', key: 'createdAt', type: 'date' }
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