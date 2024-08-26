import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Table from './table';
import { ScoreService } from '../../../services/scoreService';

function Scores() {

    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [globalScoresStats, setGlobalScoresStats] = useState(undefined);

    const columns = [
        { name: 'player.name', label: 'Player' },
        { name: 'createdAt', label: 'Date' },
        { name: 'value', label: 'Score' }
    ];

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const scores = await ScoreService.getAll();
            const globalScoresStats = await ScoreService.getStats();
            setGlobalScoresStats(globalScoresStats);
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
            {globalScoresStats && (
                <div className="stats-container">
                    <div className="stats">
                        <div className="stat-item">
                            <span className="stat-label">Total games played:</span>
                            <span className="stat-value">{globalScoresStats.scoreCount}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">High score:</span>
                            <span className="stat-value">{globalScoresStats.highScore?.value}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Average score:</span>
                            <span className="stat-value">{globalScoresStats.averageScore}</span>
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

export default Scores;