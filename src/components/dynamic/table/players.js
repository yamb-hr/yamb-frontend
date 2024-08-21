import React, { useEffect, useState } from 'react';
import Table from './table';
import { PlayerService } from '../../../services/playerService';

function Players() {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const columns = [
        { name: 'name', label: 'Name' },
        { name: 'createdAt', label: 'Date' }
    ];

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const players = await PlayerService.getAll(9999, 0, 'createdAt', 'desc');
            setData(players);
        } catch (error) {
            console.error('Failed to fetch players:', error);
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

export default Players;