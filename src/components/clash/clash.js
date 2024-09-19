import React, { useEffect, useState } from 'react';
import Table from '../dynamic/table/table';
import playerService from '../../services/playerService';
import { useTranslation } from 'react-i18next';

function Clash() {
    
    const { t } = useTranslation();
    const [data, setData] = useState([]);
    const [globalPlayerStats, setGlobalPlayerStats] = useState(undefined);
    const [isLoading, setIsLoading] = useState(true);

    const columns = [
        { name: 'name', label: 'Name' }
    ];

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const players = await playerService.getAll(0, 9999);
            const globalPlayerStats = await playerService.getStats();
            setGlobalPlayerStats(globalPlayerStats);
            setData(players._embedded.players);
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
        <div className="table-page">
            {globalPlayerStats && (
                <div className="stats-container">
                    <div className="stats">
                        <div className="stat-item">
                            <span className="stat-label">{t('total-players')}</span>
                            <span className="stat-value">{globalPlayerStats.playerCount}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">{t('newest-player')}</span>
                            <span className="stat-value">{globalPlayerStats.newestPlayer?.name}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">{t('player-with-most-games')}</span>
                            <span className="stat-value">{globalPlayerStats.playerWithMostScores?.name}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">{t('total-games')}</span>
                            <span className="stat-value">{globalPlayerStats.mostScoresByAnyPlayer}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">{t('player-with-highest-average')}</span>
                            <span className="stat-value">{globalPlayerStats.playerWithHighestAverageScore?.name}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">{t('average-score')}</span>
                            <span className="stat-value">{globalPlayerStats.highestAverageScoreByAnyPlayer}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">{t('player-with-high-score')}</span>
                            <span className="stat-value">{globalPlayerStats.highScore?.player?.name}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">{t('high-score')}</span>
                            <span className="stat-value">{globalPlayerStats.highScore?.value}</span>
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

export default Clash;