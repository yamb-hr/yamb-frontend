import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ErrorContext } from '../../providers/errorProvider';
import { PreferencesContext } from '../../providers/preferencesProvider';
import Spinner from '../spinner/spinner';
import './element.css';

const localeStringFormat = {
    year: 'numeric', month: 'long', day: 'numeric', 
    hour: 'numeric', minute: 'numeric', second: 'numeric'
};

const Element = ({ columns, data, service, id }) => {

    const navigate = useNavigate();
    const [ elementData, setElementData ] = useState(null);
    const [ loading, setLoading ] = useState(false);
    const { handleError } = useContext(ErrorContext);
    const { language } = useContext(PreferencesContext);

    useEffect(() => {
        if (service && id) {
            fetchData();
        } else if (data) {
            setElementData(data);
        }
    }, [ data, service, id ]);

    const fetchData = async () => {
        setLoading(true);
        service.getById(id).then(data => {
            setElementData(data);
        }).catch(error => {
            handleError(error);
        }).finally(() => {
            setLoading(false);
        });
    };

    const formatDate = (value) => {
        return new Date(value).toLocaleString(language, localeStringFormat);
    };

    const formatValue = (value) => {
        return typeof value === 'string' && !isNaN(Date.parse(value))
            ? formatDate(value)
            : typeof value === 'boolean'
                ? (value ? '✔' : '✘')
                : value;
    };

    const getValue = (row, key) => {
        const value = key.split('.').reduce((acc, part) => acc && acc[part], row);

        if (value && typeof value === 'object') {
            const link = value._links?.self?.href;
            if (link) {
                const segments = link.split('/');
                const resource = segments[segments.length - 2];
                const id = segments[segments.length - 1];
                const name = value.name || `View ${id}`;

                return <a onClick={() => navigate(`/${resource}/${id}`)}>{name}</a>;
            }
        }

        return formatValue(value);
    };

    if (loading) {
        return <Spinner />;
    }

    if (!elementData) {
        return <div>No data available</div>;
    }

    return (
        <div className="element-container">
            {columns.map((column) => (
                <div key={column.key} className="field">
                    <strong>{column.label}:</strong>
                    <span>{getValue(elementData, column.key)}</span>
                </div>
            ))}
        </div>
    );
};

export default Element;
