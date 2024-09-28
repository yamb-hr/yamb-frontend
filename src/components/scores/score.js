import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ErrorContext } from '../../providers/errorProvider';
import scoreService from '../../services/scoreService';
import Element from '../element/element';
import Spinner from '../spinner/spinner';
import './score.css';

function Score() {

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
        scoreService.getById(id).then(data => {
            setData(data);
        }).catch(error => {
            handleError(error);
        }).finally(() => {
            setLoading(false);
        });
    }

    const columns = [
        { label: 'Id', key: 'id' },
        { label: 'Player', key: 'player' },
        { label: 'Created Date', key: 'createdAt' }
    ];

    if (loading) {
        return (<Spinner></Spinner>);
    }

    return (
        <div className="score">
            <Element data={data} columns={columns}></Element>
        </div>
    );
};

export default Score;