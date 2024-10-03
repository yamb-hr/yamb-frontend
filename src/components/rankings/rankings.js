import React, { useEffect, useState } from 'react';
import scoreService from '../../services/scoreService';
import { useTranslation } from 'react-i18next';
import './rankings.css';
import Spinner from '../spinner/spinner';

function Rankings() {

    const { t } = useTranslation();
    const [ data, setData ] = useState([]);
    const [ loading, setLoading ] = useState(true);
    const [ globalScoreStats, setGlobalScoreStats ] = useState(undefined);

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
        <div className="rankings">
            {loading && <Spinner />}
            {globalScoreStats && (
                <div className="stats-container">
                    <div className="stats">
                        <div className="stat-item">
                            <span className="stat-label">{t('total-games')}:</span>
                            <span className="stat-value">&nbsp;{globalScoreStats.scoreCount}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">{t('average-score')}:</span>
                            <span className="stat-value">&nbsp;{globalScoreStats.averageScore?.toFixed(2)}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">{t('player-with-high-score')}:</span>
                            <span className="stat-value">&nbsp;{globalScoreStats.highScore?.player?.name}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">{t('high-score')}:</span>
                            <span className="stat-value">&nbsp;{globalScoreStats.highScore?.value}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Rankings;