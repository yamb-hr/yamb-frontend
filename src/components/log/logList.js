import React from 'react';
import { useTranslation } from 'react-i18next';
import logService from '../../services/logService';
import Table from '../table/table';
import './log.css';

function LogList() {

    const { t } = useTranslation();

    const columns = [
        { label: t("player"), key: 'player' },
        { label: t("level"), key: 'level' },
        { label: t("created-at"), key: 'createdAt' }
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