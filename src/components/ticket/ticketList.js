import React from 'react';
import { useTranslation } from 'react-i18next';
import ticketService from '../../services/ticketService';
import Table from '../table/table';
import './ticket.css';

function TicketList() {

    const { t } = useTranslation();

    const columns = [
        { label: t("player"), key: 'player' },
        { label: t("title"), key: 'title' },
        { label: t("status"), key: 'status' },
        { label: t("updated-at"), key: 'updatedAt' },
    ];

    return (
        <div className="ticket-list-container">
            <div className="ticket-list">
                <Table service={ticketService} columns={columns}></Table>
            </div>
        </div>
    );
};

export default TicketList;