import React from 'react';
import scoreService from '../../services/scoreService';
import Table from '../table/table';
import './score.css';

function ScoreList() {

    const columns = [
        { label: 'Player', key: 'player' },
        { label: 'Created Date', key: 'createdAt' }
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