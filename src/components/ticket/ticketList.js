import React from 'react';
import ticketService from '../../services/ticketService';
import Table from '../table/table';
import './ticket.css';

function TicketList() {

    const columns = [
        { label: 'Player', key: 'player' },
        { label: 'Title', key: 'title' },
        { label: 'Status', key: 'status' },
        { label: 'Updated Date', key: 'updatedAt' },
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