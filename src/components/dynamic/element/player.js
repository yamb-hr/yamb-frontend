import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Element from './element';
import playerService from '../../../services/playerService';
import { useParams } from 'react-router-dom';

function Player() {

    const { id } = useParams();
    const [ data, setData ] = useState({});
    const [ playerStats, setPlayerStats ] = useState(undefined);
    const [ relatedData, setRelatedData ] = useState({});
    const [ isLoading, setIsLoading ] = useState(true);

    const columns = [
        { name: 'name', label: 'Name' },
        { name: 'createdAt', label: 'Started on' }
    ];

    const relatedColumns = [
        { name: 'createdAt', label: 'Date' },
        { name: 'value', label: 'Score' }
    ];

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const player = await playerService.getById(id);
            const stats = await playerService.getStatsById(id);
            setData(player);
            setPlayerStats(stats);
            const scores = await playerService.getScoresByPlayerId(id);
            setRelatedData(scores);
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
            {playerStats && (
                <div className="stats-container">
                    <div className="stats">
                        <div className="stat-item">
                            <span className="stat-label">Last active on:</span>
                            <span className="stat-value">{playerStats.lastActivity}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Total games played:</span>
                            <span className="stat-value">{playerStats.scoreCount}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">High score:</span>
                            <span className="stat-value">{playerStats.highScore?.value}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Average Score:</span>
                            <span className="stat-value">{playerStats.averageScore}</span>
                        </div>
                    </div>
                </div>
            )}
            <Element 
                data={data} 
                columns={columns} 
                isLoading={isLoading} 
                relatedResource={"scores"} 
                relatedData={relatedData} 
                relatedColumns={relatedColumns} 
            />
        </div>
    );
};

export default Player;