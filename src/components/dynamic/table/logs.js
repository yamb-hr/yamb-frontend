import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Table from './table';
import { LogService } from '../../../services/logService';

function Logs() {

    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const columns = [
        { name: 'player.name', label: 'Player' },
        { name: 'createdAt', label: 'Date' }
    ];

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const logs = await LogService.getAll(9999, 0, "createdAt", "desc");
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