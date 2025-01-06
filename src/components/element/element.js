import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useTranslation } from 'react-i18next';
import { ErrorHandlerContext } from '../../providers/errorHandlerProvider';
import { PreferencesContext } from '../../providers/preferencesProvider';
import Spinner from '../spinner/spinner';
import './element.css';

const localeStringFormat = {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: 'numeric', minute: 'numeric', second: 'numeric'
};

const Element = ({ columns, data, service, id, displayHeaders = false }) => {

    const { t } = useTranslation();

    const { handleError } = useContext(ErrorHandlerContext);
    const { language } = useContext(PreferencesContext);
    
    const [elementData, setElementData] = useState(null);

    useEffect(() => {
        if (data) {
            setElementData(data);
        }
    }, [data]);

    const fetchElementData = async () => {
        const fetchedData = await service.getById(id);
        return fetchedData;
    };

    const { data: fetchedData, isLoading, isError, error } = useQuery(
        ['elementData', id],
        fetchElementData,
        {
            enabled: !!service && !!id,
            staleTime: 60000,
            cacheTime: 5 * 60 * 1000,
            onError: handleError,
        }
    );

    const element = fetchedData || elementData;

    if (service && isLoading) {
        return <Spinner />;
    }

    if (service && isError) {
        return <div>Error: {error.message}</div>;
    }

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

                return (
                    <Link to={`/${resource}/${id}`}>
                        {name}
                    </Link>
                );
            }
        }

        return formatValue(value);
    };

    if (!element) {
        return <div>{t("no-data-available")}</div>;
    }

    return (
        <div className="element-container">
            {columns.map((column) => (
                <div key={column.key} className="field">
                    {displayHeaders && <strong>{column.label}:</strong>}
                    <span className="value">{getValue(element, column.key)}</span>
                </div>
            ))}
        </div>
    );
};

export default Element;
