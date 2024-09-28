import React, { useEffect, useState } from 'react';
import scoreService from '../../services/scoreService';
import { useTranslation } from 'react-i18next';
import './rankings.css';

function Rankings() {

    const { t } = useTranslation();
    const [data, setData] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [globalScoreStats, setGlobalScoreStats] = useState(undefined);

    const columns = [
        { name: 'player.name', label: 'Player' },
        { name: 'createdAt', label: 'Date' },
        { name: 'value', label: 'Score' }
    ];

    const fetchData = async () => {
        setLoading(true);
        try {
            const scores = await scoreService.getAll(0, 9999);
            const globalScoreStats = await scoreService.getStats();
            setGlobalScoreStats(globalScoreStats);
            setData(scores);
        } catch (error) {
            console.error('Failed to fetch scores:', error);
        } finally {
            setLoading(false);
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
        </div>
    );
};

export default Rankings;