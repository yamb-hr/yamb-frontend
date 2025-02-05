import React, { useEffect, useState, useContext } from 'react';
// import { useTranslation } from 'react-i18next';
import { LoadingContext } from '../../providers/loadingProvider';
import { ErrorHandlerContext } from '../../providers/errorHandlerProvider';
import scoreService from '../../services/scoreService';
import ScoreList from '../scores/scoreList';
import Spinner from '../spinner/spinner';
import './rankings.css';

function Rankings() {

    // const { t } = useTranslation();

    const { handleError } = useContext(ErrorHandlerContext);
    const { isLoading, setLoading } = useContext(LoadingContext);

    const [scores, setScores] = useState([]);
    const [globalScoreStats, setGlobalScoreStats] = useState(undefined);

    function fetchData() {
        setLoading(true);
        scoreService.getAll(0, 9999).then(scores => {
            setScores(scores);
        }).catch(error => {
            handleError(error);
        }).finally(() => {
            scoreService.getStats().then(globalScoreStats => {
                setGlobalScoreStats(globalScoreStats);
            }).catch(error => {
                handleError(error);
            }).finally(() => {
                setLoading(false);
            })
        });
    };

    useEffect(() => {
        // fetchData();
    }, []);

    if (isLoading) {
        return <Spinner/>
    }
    
    return (
        <div className="rankings-container">
            {/* {globalScoreStats && (
                <div className="rankings">
                    <ul>
                        <li>
                            <span className="stat-label">{t('total-games')}:</span>
                            <span className="stat-value">&nbsp;{globalScoreStats.scoreCount}</span>
                        </li>
                        <li>
                            <span className="stat-label">{t('average-score')}:</span>
                            <span className="stat-value">&nbsp;{globalScoreStats.averageScore?.toFixed(2)}</span>
                        </li>
                        <li>
                            <span className="stat-label">{t('player-with-high-score')}:</span>
                            <span className="stat-value">&nbsp;{globalScoreStats.highScore?.player?.name}</span>
                        </li>
                        <li>
                            <span className="stat-label">{t('high-score')}:</span>
                            <span className="stat-value">&nbsp;{globalScoreStats.highScore?.value}</span>
                        </li>
                    </ul>
                </div>
            )} */}
            <ScoreList />
        </div>
    );
};

export default Rankings;