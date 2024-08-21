import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Table from './table';
import { GameService } from '../../../services/gameService';

function Games() {

    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const columns = [
        { name: 'player.name', label: 'Player' },
        { name: 'status', label: 'Status' },
        { name: 'updatedAt', label: 'Last Played' }
    ];

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const games = await GameService.getAll(9999, 0, 'updatedAt', 'desc');
            setData(games);
        } catch (error) {
            console.error('Failed to fetch games:', error);
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

export default Games;