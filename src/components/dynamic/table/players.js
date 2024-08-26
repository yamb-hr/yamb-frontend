import React, { useEffect, useState } from 'react';
import Table from './table';
import { PlayerService } from '../../../services/playerService';

function Players() {
    const [data, setData] = useState([]);
    const [globalPlayerStats, setGlobalPlayerStats] = useState(undefined);
    const [isLoading, setIsLoading] = useState(true);

    const columns = [
        { name: 'name', label: 'Name' },
        { name: 'createdAt', label: 'Date' }
    ];

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const players = await PlayerService.getAll();
            const globalPlayerStats = await PlayerService.getStats();
            setGlobalPlayerStats(globalPlayerStats);
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
            {globalPlayerStats && (
                <div className="stats-container">
                    <div className="stats">
                        <div className="stat-item">
                            <span className="stat-label">Player count:</span>
                            <span className="stat-value">{globalPlayerStats.playerCount}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Most scores by any player:</span>
                            <span className="stat-value">{globalPlayerStats.mostScoresByAnyPlayer}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Player with most scores:</span>
                            <span className="stat-value">{globalPlayerStats.playerWithMostScores?.name}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Highest average score by any player:</span>
                            <span className="stat-value">{globalPlayerStats.highestAverageScoreByAnyPlayer}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Player with highest average score:</span>
                            <span className="stat-value">{globalPlayerStats.playerWithHighestAverageScore?.name}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">High score:</span>
                            <span className="stat-value">{globalPlayerStats.highScore?.value}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Latest player:</span>
                            <span className="stat-value">{globalPlayerStats.newestPlayer?.name}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">First player:</span>
                            <span className="stat-value">{globalPlayerStats.oldestPlayer?.name}</span>
                        </div>
                    </div>
                </div>
            )}
            <Table 
                data={data} 
                columns={columns} 
                isLoading={isLoading} 
            />
        </div>
    );
};

export default Players;