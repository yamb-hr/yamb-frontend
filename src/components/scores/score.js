import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ErrorHandlerContext } from '../../providers/errorHandlerProvider';
import scoreService from '../../services/scoreService';
import Element from '../element/element';
import Spinner from '../spinner/spinner';
import './score.css';

function Score() {

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
        scoreService.getById(id).then(data => {
            setData(data);
        }).catch(error => {
            handleError(error);
        }).finally(() => {
            setLoading(false);
        });
    }

    const columns = [
        { label: t("player"), key: 'player' },
        { label: t("date"), key: 'createdAt' }
    ];

    if (loading) {
        return (<Spinner></Spinner>);
    }

    return (
        <div className="score-container">
            <div className="score">
                <Element data={data} columns={columns}></Element>
            </div>
        </div>
    );
};

export default Score;