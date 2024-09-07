import React, { useContext, useEffect, useState } from 'react';
import playerService from '../../services/playerService';
import { LanguageContext } from '../../App';
import { CurrentUserContext } from '../../App';
import Element from '../dynamic/element/element';

function Profile() {

    const { currentUser } = useContext(CurrentUserContext);
    const [ data, setData ] = useState({});
    const [ playerStats, setPlayerStats ] = useState(undefined);
    const [ relatedData, setRelatedData ] = useState({});
    const [ isLoading, setIsLoading ] = useState(true);
    const { language } = useContext(LanguageContext);

    const columns = [
        { name: 'name', label: 'Name' },
        { name: 'createdAt', label: 'Started on' }
    ];

    const relatedColumns = [
        { name: 'createdAt', label: 'Date' },
        { name: 'value', label: 'Score' }
    ];

    const localeStringFormat = {
        year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric'
    };

    const fetchData = async () => {
        if (currentUser) {
            try {   
                setIsLoading(true);
                const player = await playerService.getById(currentUser.id);
                const stats = await playerService.getStatsById(currentUser.id);
                setData(player);
                setPlayerStats(stats);
                const scores = await playerService.getScoresByPlayerId(currentUser.id);
                setRelatedData(scores);
            } catch (error) {
                console.error('Failed to fetch player:', error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchData();
    }, [currentUser]);

    return (
        <div>
            {playerStats && (
                <div className="stats-container">
                    <div className="stats">
                        <div className="stat-item">
                            <span className="stat-label">Last active on:</span>
                            <span className="stat-value">{new Date(playerStats.lastActivity).toLocaleString(language, localeStringFormat)}</span>
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
                            <span className="stat-value">{playerStats.averageScore?.toFixed(2)}</span>
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

export default Profile;