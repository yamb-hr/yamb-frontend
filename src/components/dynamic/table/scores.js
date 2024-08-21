import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Table from './table';
import { ScoreService } from '../../../services/scoreService';

function Scores() {

    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const columns = [
        { name: 'player.name', label: 'Player' },
        { name: 'createdAt', label: 'Date' },
        { name: 'value', label: 'Score' }
    ];

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const scores = await ScoreService.getAll(9999, 0, "createdAt", "desc");
            setData(scores);
        } catch (error) {
            console.error('Failed to fetch scores:', error);
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

export default Scores;