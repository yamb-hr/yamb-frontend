import React from 'react';
import logService from '../../services/logService';
import Table from '../table/table';
import './log.css';

function LogList() {

    const columns = [
        { label: 'Player', key: 'player' },
        { label: 'Level', key: 'level' },
        { label: 'Created Date', key: 'createdAt' }
    ];

    return (
        <div className="log-list-container">
            <div className="log-list">
                <Table service={logService} columns={columns}></Table>
            </div>
        </div>
    );
};

export default LogList;