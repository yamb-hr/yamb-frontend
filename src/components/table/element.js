import React, { useContext } from 'react';
import { LanguageContext } from '../../App';
import './element.css';

const Element = ({ data, columns, isLoading }) => {
    const { language } = useContext(LanguageContext);

    if (isLoading || !data) {
        return <div className="loading">Loading...</div>;
    }

    const formatDate = (value) => {
        return new Date(value).toLocaleString(language, localeStringFormat);
    };

    const localeStringFormat = {
        year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric'
    };

    const formatValue = (value) => {
        return typeof value === 'string' && !isNaN(Date.parse(value))
            ? formatDate(value)
            : value;
    };

    const getNestedValue = (obj, path) => {
        return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    };

    return (
        <div className="element-container">
            {columns.map(({ name, label }) => (
                <div key={name} className="element-row">
                    <div className="element-label">{label}:</div>
                    <div className="element-value">{formatValue(getNestedValue(data, name))}</div>
                </div>
            ))}
        </div>
    );
};

export default Element;
