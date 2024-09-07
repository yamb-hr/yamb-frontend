import React, { useEffect, useState } from 'react';
import Element from './element';
import logService from '../../../services/logService';
import { useParams } from 'react-router-dom';

function Log() {

    const { id } = useParams();
    const [data, setData] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    const columns = [
        { name: 'player.name', label: 'Player' },
        { name: 'createdAt', label: 'Date' },
        { name: 'level', label: 'Level' },
        { name: 'message', label: 'Message' },
        { name: 'type', label: 'Type' }
    ];

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const log = await logService.getById(id);
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
        <div className="element-page">
            <Element 
                data={data} 
                columns={columns} 
                isLoading={isLoading} 
            />
        </div>
    );
};

export default Log;