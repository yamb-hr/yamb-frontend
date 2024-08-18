import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Element from './element';
import { PlayerService } from '../../services/playerService';
import { useParams } from 'react-router-dom';

function Player() {

    const { id } = useParams(); // Gets the 'id' from the URL
    const [data, setData] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    const columns = [
        { name: 'name', label: 'Name' },
        { name: 'createdAt', label: 'Date' }
    ];

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const player = await PlayerService.getById(id);
            setData(player);
        } catch (error) {
            console.error('Failed to fetch player:', error);
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

export default Player;