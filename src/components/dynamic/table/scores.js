import React, { useEffect, useState } from 'react';
import Table from './table';
import scoreService from '../../../services/scoreService';
import { useTranslation } from 'react-i18next';

function Scores() {

    const { t } = useTranslation();
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [globalScoreStats, setGlobalScoreStats] = useState(undefined);

    const columns = [
        { name: 'player.name', label: 'Player' },
        { name: 'createdAt', label: 'Date' },
        { name: 'value', label: 'Score' }
    ];

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const scores = await scoreService.getAll();
            const globalScoreStats = await scoreService.getStats();
            setGlobalScoreStats(globalScoreStats);
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
        <div className="table-page">
            {globalScoreStats && (
                <div className="stats-container">
                    <div className="stats">
                        <div className="stat-item">
                            <span className="stat-label">{t('total-games')}</span>
                            <span className="stat-value">{globalScoreStats.scoreCount}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">{t('average-score')}</span>
                            <span className="stat-value">{globalScoreStats.averageScore?.toFixed(2)}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">{t('player-with-high-score')}</span>
                            <span className="stat-value">{globalScoreStats.highScore?.player?.name}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">{t('high-score')}</span>
                            <span className="stat-value">{globalScoreStats.highScore?.value}</span>
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