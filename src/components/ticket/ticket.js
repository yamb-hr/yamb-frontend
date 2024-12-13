import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ErrorHandlerContext } from '../../providers/errorHandlerProvider';
import ticketService from '../../services/ticketService';
import Element from '../element/element';
import Spinner from '../spinner/spinner';
import './ticket.css';

function Ticket() {

    const { id } = useParams();
    const [ data, setData ] = useState(null);
    const [ loading, setLoading ] = useState(true);
    const { handleError } = useContext(ErrorHandlerContext);

    useEffect(() => {
        if (id && !data) {
            fetchData();
        }
    }, [id]);

    const fetchData = () => {
        setLoading(true);
        ticketService.getById(id).then(data => {
            setData(data);
        }).catch(error => {
            handleError(error);
        }).finally(() => {
            setLoading(false);
        });
    }

    const columns = [
        { label: 'Player', key: 'player' },
        { label: 'Title', key: 'title' },
        { label: 'Status', key: 'status' },
        { label: 'Created Date', key: 'createdAt' },
        { label: 'Updated Date', key: 'updatedAt' },
        { label: 'Description', key: 'description' }
    ];

    if (loading) {
        return (<Spinner></Spinner>);
    }

    return (
        <div className="ticket-container">
            <div className="ticket">
                <Element data={data} columns={columns}></Element>
            </div>
        </div>
    );
};

export default Ticket;