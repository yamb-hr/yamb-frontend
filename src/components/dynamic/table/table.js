import React, { useContext, useState } from 'react';
import { LanguageContext } from '../../../App';
import { useLocation, useNavigate } from 'react-router-dom';
import './table.css';

function Table ({ data, columns, isLoading }) {

  const location = useLocation();
  const navigate = useNavigate();  
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
  const { language } = useContext(LanguageContext);

  const onSort = (key) => {
	let direction = 'asc';
	if (sortConfig.key === key && sortConfig.direction === 'asc') {
	  direction = 'desc';
	}
	setSortConfig({ key, direction });
  };

  const sortedData = React.useMemo(() => {
	if (!sortConfig.key) return data;
	return [...data].sort((a, b) => {
	  if (a[sortConfig.key] < b[sortConfig.key]) {
		return sortConfig.direction === 'asc' ? -1 : 1;
	  }
	  if (a[sortConfig.key] > b[sortConfig.key]) {
		return sortConfig.direction === 'asc' ? 1 : -1;
	  }
	  return 0;
	});
  }, [data, sortConfig]);

  const paginatedData = React.useMemo(() => {
	const startIndex = (currentPage - 1) * rowsPerPage;
	return sortedData.slice(startIndex, startIndex + rowsPerPage);
  }, [sortedData, currentPage, rowsPerPage]);

  const handlePageChange = (direction) => {
	setCurrentPage((prev) => {
	  if (direction === 'next') return prev + 1;
	  if (direction === 'prev') return prev - 1;
	  return prev;
	});
  };

  const handleRowsPerPageChange = (e) => {
	setRowsPerPage(Number(e.target.value));
	setCurrentPage(1); // reset to first page when changing rows per page
  };

  if (isLoading) {
	return <div>Loading...</div>;
  }
  
  const localeStringFormat = {
	year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric'
  }

  const formatDate = (value) => {
	return new Date(value).toLocaleString(language, localeStringFormat)
  };

  const formatValue = (value) => {
	// Apply formatting based on type, here checking for date-like strings
	return typeof value === 'string' && !isNaN(Date.parse(value))
	  ? formatDate(value)
	  : value;
  };

  const getNestedValue = (obj, path) => {
	return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  };

  return (
	<div className="table-container">
	  {data && columns && (
		<div>
			<table className="table">
				<thead>
					<tr>
						{columns.map(({ name, label }) => (
							<th key={name} onClick={() => onSort(name)}>
							{label} {sortConfig.key === name ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
						  </th>
						))}
					</tr>
				</thead>
				<tbody>
				  {paginatedData.map((row, index) => (
					<tr key={index} onClick={() => {navigate(location.pathname + "/" + row['id'])}}>
					  {columns.map(({ name }) => (
						<td key={name}>{formatValue(getNestedValue(row, name))}</td>
					  ))}
					</tr>
				  ))}
				</tbody>
			</table>
			<div>
			  <button className="pagination-button" onClick={() => handlePageChange('prev')} disabled={currentPage === 1}>
				{'<'}
			  </button>
			  &nbsp;
			  <span className="page-number">
				{currentPage} of {Math.ceil(data.length / rowsPerPage)}
			  </span>
			  &nbsp;
			  <button className="pagination-button" onClick={() => handlePageChange('next')} disabled={currentPage === Math.ceil(data.length / rowsPerPage)}>
				{'>'}
			  </button>
			  &nbsp;
			  <select value={rowsPerPage} onChange={handleRowsPerPageChange}>
				<option value={2}>2</option>
				<option value={10}>10</option>
				<option value={20}>20</option>
				<option value={50}>50</option>
				<option value={100}>100</option>
				<option value={200}>200</option>
				<option value={500}>500</option>
			  </select>
			</div>
		</div>
	  )}
	</div>
  );
};

export default Table;
