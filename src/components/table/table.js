import React, { useState, useEffect } from 'react';
import Spinner from '../spinner/spinner';
import './table.css';

const flattenRow = (row, columns) => {
	let flattened = {};
	columns.forEach(({ accessor }) => {
		const value = accessor.split('.').reduce((obj, key) => (obj ? obj[key] : ''), row);

		if (Array.isArray(value)) {
			flattened[accessor] = value.length
				? value
						.map((item) => (typeof item === 'object' && item !== null ? item.name || JSON.stringify(item) : item))
						.join(', ')
				: 'No data';
		} else if (typeof value === 'object' && value !== null) {
			flattened[accessor] = JSON.stringify(value);
		} else {
			flattened[accessor] = value;
		}
	});
	return flattened;
};

const Table = ({ service }) => {
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [currentPage, setCurrentPage] = useState(1);
	const [rows, setRows] = useState([]);
	const [columns, setColumns] = useState([]);
	const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
	const [editIdx, setEditIdx] = useState(-1);
	const [loading, setLoading] = useState(true);
	const [selectedRows, setSelectedRows] = useState([]);
	const [showActions, setShowActions] = useState({});

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				const data = await service.getAll();
				setRows(data);

				if (data.length > 0) {
					const cols = Object.keys(data[0]).map((key) => {
						if (typeof data[0][key] === 'object' && data[0][key] !== null) {
							return Object.keys(data[0][key]).map((nestedKey) => ({
								header: `${key.charAt(0).toUpperCase() + key.slice(1)} ${nestedKey.charAt(0).toUpperCase() + nestedKey.slice(1)}`,
								accessor: `${key}.${nestedKey}`,
								nested: true
							}));
						} else {
							return {
								header: key.charAt(0).toUpperCase() + key.slice(1),
								accessor: key,
								nested: false
							};
						}
					});

					setColumns(cols.flat());
				}
			} catch (error) {
				console.error("Error fetching data", error);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, [service]);

	const sortedData = [...rows].sort((a, b) => {
		if (sortConfig.key) {
			const key = sortConfig.key;
			const direction = sortConfig.direction === 'asc' ? 1 : -1;
			const aValue = a[key];
			const bValue = b[key];
			return (aValue > bValue ? 1 : -1) * direction;
		}
		return 0;
	});

	const startRowIndex = (currentPage - 1) * rowsPerPage;
	const paginatedData = sortedData.slice(startRowIndex, startRowIndex + rowsPerPage).map((row) => flattenRow(row, columns));
	const totalPages = Math.ceil(rows.length / rowsPerPage);

	const requestSort = (key) => {
		let direction = 'asc';
		if (sortConfig.key === key && sortConfig.direction === 'asc') {
			direction = 'desc';
		}
		setSortConfig({ key, direction });
	};

	const handleEdit = (idx) => setEditIdx(idx);
	const handleDelete = (idx) => setEditIdx(-1);

	const handleGlobalSave = () => {
		const updatedRows = rows.filter((_, idx) => selectedRows.includes(idx));
		console.log('Global Save for rows:', updatedRows);
	};

	const handleGlobalDelete = () => {
		const updatedRows = rows.filter((_, idx) => !selectedRows.includes(idx));
		setRows(updatedRows);
		setSelectedRows([]);
	};

	const handleChange = (e, rowIndex, columnName) => {
		const newRows = rows.map((row, index) => {
			if (index === rowIndex) {
				return { ...row, [columnName]: e.target.value };
			}
			return row;
		});
		setRows(newRows);
	};

	const handleRowCheckboxChange = (idx) => {
		if (selectedRows.includes(idx)) {
			setSelectedRows(selectedRows.filter((rowIdx) => rowIdx !== idx));
		} else {
			setSelectedRows([...selectedRows, idx]);
		}
	};

	const toggleRowActions = (idx) => {
		setShowActions((prevState) => ({
			...prevState,
			[idx]: !prevState[idx]
		}));
	};

	const handleRowsPerPageChange = (e) => {
		setRowsPerPage(Number(e.target.value));
		setCurrentPage(1);
	};

	const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
	const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

	if (loading) {
		return <Spinner />;
	}

	return (
		<div className="table-container">
			<div className="global-actions">
				<button className="save" onClick={handleGlobalSave} disabled={selectedRows.length === 0}>
					Save
				</button>
				<button className="delete" onClick={handleGlobalDelete} disabled={selectedRows.length === 0}>
					Delete
				</button>
			</div>
			<table>
				<thead>
					<tr>
						<th></th>
						{columns.map((col) => (
							<th key={col.accessor} onClick={() => requestSort(col.accessor)}>
								{col.header}
								<span className={sortConfig.key === col.accessor ? (sortConfig.direction === 'asc' ? 'sort-asc' : 'sort-desc') : ''}></span>
							</th>
						))}
						<th></th>
					</tr>
				</thead>
				<tbody>
					{paginatedData.map((row, rowIndex) => (
						<tr key={row.id}>
							<td>
								<input
									type="checkbox"
									checked={selectedRows.includes(rowIndex)}
									onChange={() => handleRowCheckboxChange(rowIndex)}
								/>
							</td>
							{columns.map((col) => (
								<td key={col.accessor}>
									{editIdx === rowIndex && (typeof row[col.accessor] !== 'object' && !Array.isArray(row[col.accessor])) ? (
										<input
											type="text"
											value={row[col.accessor]}
											onChange={(e) => handleChange(e, rowIndex, col.accessor)}
										/>
									) : (
										<span>{row[col.accessor]}</span>
									)}
								</td>
							))}
							<td>
								<button className="dropdown-actions-button" onClick={() => toggleRowActions(rowIndex)}><span className="icon">&#11167;</span></button>
								{showActions[rowIndex] && (
									<div className="dropdown-actions">
										<button onClick={() => handleEdit(rowIndex)}>Edit</button>
										<button onClick={() => handleDelete(rowIndex)}>Delete</button>
									</div>
								)}
							</td>
						</tr>
					))}
				</tbody>
			</table>

			<div className="pagination">
				<button onClick={prevPage} disabled={currentPage === 1}>
					Previous
				</button>
				<span>
					Page {currentPage} of {totalPages}
				</span>
				<button onClick={nextPage} disabled={currentPage === totalPages}>
					Next
				</button>
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
	);
};

export default Table;
