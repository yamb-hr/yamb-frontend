import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PreferencesContext } from '../../providers/preferencesProvider';
import { ErrorContext } from '../../providers/errorProvider';
import Spinner from '../spinner/spinner';
import './table.css';

const localeStringFormat = {
    year: 'numeric', month: 'long', day: 'numeric', 
    hour: 'numeric', minute: 'numeric', second: 'numeric'
};

const Table = ({ columns, data, service }) => {

    const navigate = useNavigate();
    const [ tableData, setTableData ] = useState([]);
    const [ loading, setLoading ] = useState(false);
    const [ page, setPage ] = useState(0);
    const [ pageSize, setPageSize ] = useState(50);
    const [ sortColumn, setSortColumn ] = useState(null);
    const [ sortDirection, setSortDirection ] = useState('asc');
    const { handleError } = useContext(ErrorContext);
    const { language } = useContext(PreferencesContext);

    useEffect(() => {
        if (service) {
            fetchData();
        } else if (data) {
            setTableData(data);
        }
    }, [data, service]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const result = await service.getAll(0, 9999, sortColumn, sortDirection);
            const fetchedData = result._embedded[Object.keys(result._embedded)[0]];
            setTableData(fetchedData);
        } catch (error) {
            handleError(error);
        } finally {
            setLoading(false);
        }
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
        return [...data].sort((a, b) => {
            const valueA = getValue(a, sortColumn);
            const valueB = getValue(b, sortColumn);
            if (valueA === valueB) return 0;
            if (sortDirection === 'asc') {
                return valueA > valueB ? 1 : -1;
            } else {
                return valueA < valueB ? 1 : -1;
            }
        });
    };

    const getPaginatedData = (data) => {
        if (data.length > 0) {
            if (service) {
                const startIndex = page * pageSize;
                const endIndex = startIndex + pageSize;
                return data.slice(startIndex, endIndex);
            }
            return data;
        }
    };

    const getValue = (row, key) => {
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
                    <a 
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/${resource}/${id}`);
                        }}
                    >
                        {name}
                    </a>
                );
            }
        }
    
        return formatValue(value);
    };

    const handleRowClick = (row) => {
        if (row.id) {
            const resourceId = row.id;
            if (resourceId) {
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
    const displayData = getPaginatedData(sortedData);

    const totalPages = Math.ceil(tableData.length / pageSize);

    if (loading) {
        return (<Spinner />);
    }

    return (
        <div className="table-container">
            <table>
                <thead>
                    <tr>
                        {columns && columns.map((column) => (
                            <th key={column.key} onClick={() => handleSort(column.key)}>
                                {column.label} {sortColumn === column.key ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {displayData && displayData.map((row) => (
                        <tr key={row.id} onClick={() => handleRowClick(row)}>
                            {columns.map((column) => (
                                <td key={column.key}>
                                    {getValue(row, column.key)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            {service && <div className="pagination-controls">
                <button disabled={page === 0} onClick={() => setPage(page - 1)}>
                    Previous
                </button>
                <span>
                    Page {page + 1} of {totalPages}
                </span>
                <button disabled={page + 1 >= totalPages} onClick={() => setPage(page + 1)}>
                    Next
                </button>
                <select value={pageSize}
                    onChange={(e) => {
                        setPageSize(Number(e.target.value));
                        setPage(0);
                    }}>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                </select>
            </div>}
        </div>
    );
};

export default Table;
