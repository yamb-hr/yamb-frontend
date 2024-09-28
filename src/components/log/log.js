import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ErrorContext } from '../../providers/errorProvider';
import logService from '../../services/logService';
import Element from '../element/element';
import Spinner from '../spinner/spinner';
import './log.css';

function Log() {

    const { id } = useParams();
    const [ data, setData ] = useState(null);
    const [ loading, setLoading ] = useState(true);
    const { handleError } = useContext(ErrorContext);

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
        { label: 'Player', key: 'player' },
        { label: 'Level', key: 'level' },
        { label: 'Date', key: 'createdAt' },
        { label: 'Message', key: 'message' },

    ];

    if (loading) {
        return (<Spinner></Spinner>);
    }

    return (
        <div className="log">
            <Element data={data} columns={columns}></Element>
        </div>
    );
};

export default Log;