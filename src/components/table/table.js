import React, { useState, useContext, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useTranslation } from 'react-i18next';
import { PreferencesContext } from '../../providers/preferencesProvider';
import { ErrorHandlerContext } from '../../providers/errorHandlerProvider';
import Spinner from '../spinner/spinner';
import './table.css';

const localeStringFormat = {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: 'numeric', minute: 'numeric', second: 'numeric',
};

const Table = ({ columns, data, service, progress, selectable = false, selectedRows = [], onRowSelection = () => {}, paginated = true, displayHeader = true }) => {
    
    const navigate = useNavigate();
    const { t } = useTranslation();

    const { handleError } = useContext(ErrorHandlerContext);
    const { language } = useContext(PreferencesContext);

    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(50);
    const [sortColumn, setSortColumn] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');

    const fetchTableData = useCallback(async () => {
        if (!service) return [];
        const result = await service.getAll(0, 9999, sortColumn, sortDirection);
        if (!result._embedded) return [];
        return result._embedded[Object.keys(result._embedded)[0]];
    }, [service?.name, sortColumn, sortDirection]);

    const { data: fetchedData, isLoading, isError, error } = useQuery(
        ['tableData', service?.name, sortColumn, sortDirection],
        fetchTableData,
        {
            enabled: !!service,
            keepPreviousData: true,
            staleTime: 60000,
            cacheTime: 5 * 60 * 1000,
            onError: handleError,
        }
    );

    const tableData = data || fetchedData || [];

    if (service && isLoading) {
        return <Spinner />
    }

    if (service && isError) {
        handleError(error);
        return null;
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

    const handleSort = (columnKey) => {
        if (sortColumn === columnKey) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(columnKey);
            setSortDirection('asc');
        }
    };

    const sortData = (data) => {
        if (!sortColumn) return data;

        const columnType = columns.find(col => col.key === sortColumn)?.type || 'string';

        return data.sort((a, b) => {
            const valueA = getValue(a, sortColumn);
            const valueB = getValue(b, sortColumn);

            switch (columnType) {
                case 'date':
                    return sortDirection === 'asc'
                        ? new Date(valueA) - new Date(valueB)
                        : new Date(valueB) - new Date(valueA);
                case 'number':
                    return sortDirection === 'asc'
                        ? parseFloat(valueA) - parseFloat(valueB)
                        : parseFloat(valueB) - parseFloat(valueA);
                case 'string':
                default:
                    return sortDirection === 'asc'
                        ? String(valueA).localeCompare(String(valueB))
                        : String(valueB).localeCompare(String(valueA));
            }
        });
    };

    const getPaginatedData = (data) => {
        const startIndex = page * pageSize;
        const endIndex = startIndex + pageSize;
        return data.slice(startIndex, endIndex);
    };

    const getValue = (row, key) => {
        const value = key.split('.').reduce((acc, part) => acc && acc[part], row);
        if (value && typeof value === 'object' && value.name) {
            return value.name;
        }
        return value;
    };

    const getFormattedValue = (row, key) => {
        const value = key.split('.').reduce((acc, part) => acc && acc[part], row);
        if (value && typeof value === 'object') {
            const link = value._links?.self?.href;
            if (link) {
                const segments = link.split('/');
                const resource = segments[segments.length - 2];
                const id = segments[segments.length - 1];
                const truncatedId = id.substring(0, 5);
                const name = value.name || `View ${truncatedId}`;

                return (
                    <Link to={`/${resource}/${id}`} onClick={(e) => e.stopPropagation()}>
                        {name}
                    </Link>
                );
            }
        }

        return formatValue(value);
    }

    const handleRowClick = (row) => {
        if (row.id) {
            if (selectable) {
                onRowSelection(row.id);
            } else {
                const resourceId = row.id;
                const link = row._links?.self?.href;
                if (link) {
                    const segments = link.split('/');
                    const resource = segments[segments.length - 2];
                    navigate(`/${resource}/${resourceId}`);
                }
            }
        }
    };

    const sortedData = sortData(tableData);
    const displayData = paginated ? getPaginatedData(sortedData) : sortedData;
    const totalPages = Math.ceil(tableData.length / pageSize);
    const progressKey = progress?.key;

    return (
        <div className="table-container">
            <table>
                {displayHeader && (
                    <thead>
                        <tr>
                            {selectable && <th></th>}
                            {columns.map((column) => (
                                <th key={column.key} onClick={() => handleSort(column.key)}>
                                    {column.label} {sortColumn === column.key ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
                                </th>
                            ))}
                        </tr>
                    </thead>
                )}
                <tbody>
                    {displayData.map((row) => {
                        const progressValue = progressKey
                            ? Math.max(0, Math.min(100, parseFloat(row[progressKey] * 100) || 0))
                            : 0;

                        // let rowStyle = progressKey
                        //     ? {
                        //         background: `linear-gradient(to right, #4caf50 ${progressValue}%, #ffffff ${progressValue}%)`
                        //       }
                        //     : undefined;

                        const rowStyle = {outline: selectedRows.includes(row.id) ? '1px solid red' : ''};

                        return (
                            <tr
                                key={row.id}
                                onClick={() => handleRowClick(row)}
                                style={rowStyle}
                            >
                                {/* {selectable && (
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={selectedRows.includes(row.id)}
                                            readOnly
                                        />
                                    </td>
                                )} */}
                                {columns.map((column) => (
                                    <td key={column.key} className={typeof column.render === 'function' ? 'function' : ''}>
                                        {typeof column.render === 'function'
                                            ? column.render(row)
                                            : getFormattedValue(row, column.key)}
                                    </td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {paginated && (
                <div className="pagination-controls">
                    <button disabled={page === 0} onClick={() => setPage(page - 1)}>
                        {t("previous")}
                    </button>
                    <span className="page">
                        {t("page")}&nbsp;{page + 1}&nbsp;{t("of")}&nbsp;{totalPages}
                    </span>
                    <button disabled={page + 1 >= totalPages} onClick={() => setPage(page + 1)}>
                        {t("next")}
                    </button>
                    <select
                        value={pageSize}
                        onChange={(e) => {
                            setPageSize(Number(e.target.value));
                            setPage(0);
                        }}
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                </div>
            )}
        </div>
    );
};


export default Table;
