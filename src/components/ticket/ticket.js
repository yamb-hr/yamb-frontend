import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ErrorHandlerContext } from '../../providers/errorHandlerProvider';
import ticketService from '../../services/ticketService';
import Element from '../element/element';
import Spinner from '../spinner/spinner';
import './ticket.css';

function Ticket() {

    const { id } = useParams();
    const { t } = useTranslation();

    const { handleError } = useContext(ErrorHandlerContext);

    const [ data, setData ] = useState(null);
    const [ loading, setLoading ] = useState(true);

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
        { label: t("player"), key: 'player' },
        { label: t("title"), key: 'title' },
        { label: t("status"), key: 'status' },
        { label: t("created-at"), key: 'createdAt' },
        { label: t("updated-at"), key: 'updatedAt' },
        { label: t("description"), key: 'description' }
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