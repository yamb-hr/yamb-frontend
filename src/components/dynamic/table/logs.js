import React, { useEffect, useState } from 'react';
import Table from './table';
import logService from '../../../services/logService';

function Logs() {

    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const columns = [
        { name: 'player.name', label: 'Player' },
        { name: 'createdAt', label: 'Date' },
        { name: 'level', label: 'Level' }
    ];

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const logs = await logService.getAll();
            setData(logs);
        } catch (error) {
            console.error('Failed to fetch logs:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div>
            <Table 
                data={data} 
                columns={columns} 
                isLoading={isLoading} 
            />
        </div>
    );
};

export default Logs;