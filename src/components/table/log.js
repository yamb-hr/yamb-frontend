import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Element from './element';
import { LogService } from '../../services/logService';
import { useParams } from 'react-router-dom';

function Log() {

    const { id } = useParams(); // Gets the 'id' from the URL
    const [data, setData] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    const columns = [
        { name: 'player.name', label: 'Player' },
        { name: 'createdAt', label: 'Date' }
    ];

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const log = await LogService.getById(id);
            setData(log);
        } catch (error) {
            console.error('Failed to fetch log:', error);
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

export default Log;