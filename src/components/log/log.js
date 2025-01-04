import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ErrorHandlerContext } from '../../providers/errorHandlerProvider';
import logService from '../../services/logService';
import Element from '../element/element';
import Spinner from '../spinner/spinner';
import './log.css';

function Log() {

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
        logService.getById(id).then(data => {
            setData(data);
        }).catch(error => {
            handleError(error);
        }).finally(() => {
            setLoading(false);
        });
    }

    const columns = [
        { label: t("player"), key: 'player' },
        { label: t("level"), key: 'level' },
        { label: t("date"), key: 'createdAt' },
        { label: t("message"), key: 'message' },

    ];

    if (loading) {
        return (<Spinner></Spinner>);
    }

    return (
        <div className="log-container">
            <div className="log">
                <Element data={data} columns={columns}></Element>
            </div>
        </div>
    );
};

export default Log;