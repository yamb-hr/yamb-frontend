import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Element from './element';
import { ScoreService } from '../../services/scoreService';
import { useParams } from 'react-router-dom';

function Score() {

    const { id } = useParams(); // Gets the 'id' from the URL
    const [data, setData] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    const columns = [
        { name: 'player.name', label: 'Player' },
        { name: 'createdAt', label: 'Date' },
        { name: 'value', label: 'Value' }
    ];

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const score = await ScoreService.getById(id);
            setData(score);
        } catch (error) {
            console.error('Failed to fetch score:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div>
            <Element 
                data={data} 
                columns={columns} 
                isLoading={isLoading} 
            />
        </div>
    );
};

export default Score;