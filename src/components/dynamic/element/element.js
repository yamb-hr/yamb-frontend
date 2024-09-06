import React, { useContext } from 'react';
import { LanguageContext } from '../../../App';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './element.css';

function Element({ data, columns, isLoading, relatedResource, relatedData, relatedColumns }) {
    
    const { language } = useContext(LanguageContext);
    const navigate = useNavigate();    
    const { t } = useTranslation();

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
        if (value === null || value === undefined) {
            return 'Unknown';
        }
        return typeof value === 'string' && !isNaN(Date.parse(value))
            ? formatDate(value)
            : value;
    };

    const getNestedValue = (obj, path) => {
        return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    };

    const handleClick = (path) => {
        path = path.split('.')[0] + '.id';
        const id = getNestedValue(data, path);
        path = path.split('.')[0] + 's';
        if (id) {
            navigate(`/${path}/${id}`);
        }
    };

    return (
        <div className="element-container">
            <div className="element-rows">
                {columns.map(({ name, label }) => {
                    const value = formatValue(getNestedValue(data, name));
                    const isNested = name.includes('.');
                    return (
                        <div key={name} className="element-row">
                            <div className="element-label">{label}:&nbsp;</div>
                            <div
                                className={`element-value ${isNested ? 'clickable' : ''}`}
                                onClick={() => isNested && handleClick(name)}
                                style={{ cursor: isNested ? 'pointer' : 'default' }}
                            >
                                {value}
                            </div>
                        </div>
                    );
                })}
            </div>
            {relatedData && relatedColumns && (
                <div className="related-table-container">
                    <table className="related-table">
                        <thead>
                            <tr>
                                {relatedColumns.map(({ name, label }) => (
                                    <th key={name}>{label}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {relatedData.map((row, index) => (
                                <tr key={index} onClick={() => {navigate(`/${relatedResource}/${row['id']}`)}}>
                                    {relatedColumns.map(({ name }) => (
                                        <td key={name}>{formatValue(getNestedValue(row, name))}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Element;
