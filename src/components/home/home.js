import { useContext, useEffect, useState } from "react";
import { ErrorContext } from "../../App";
import scoreService from "../../services/scoreService";
import "./home.css";

function Home() {

    const [ data, setData ] = useState(null);
    const { handleError } = useContext(ErrorContext); 
    const [expandedSection, setExpandedSection] = useState(null);
    const toggleSection = (section) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    useEffect(() => {
        scoreService.getScoreboard()
        .then(data => {
            console.log(data);
            setData(data);  
        }
        ).catch(error => {
            handleError(error);
        });
    }, []);

    const renderScoreList = (scores) => {
        //short to 10
        scores = scores.slice(0, 10);
        return (
            <ul>
                {scores.map((score, index) => (
                    <li key={index}>
                        {index+1}.&nbsp;<span className="player-name">{score.player.name}</span> - <span className="score-value">{score.value}</span>
                    </li>
                ))}
            </ul>
        );
    };

    return (
        data &&
        <div className="scoreboard">
            <h2>Scoreboard</h2>
            <div className="scoreboard-summary">
                <div><strong>Games Played:</strong> {data.gamesPlayed}</div>&nbsp;&nbsp;
                <div><strong>Average Score:</strong> {data.averageScore.toFixed(2)}</div>&nbsp;&nbsp;
                <div><strong>Top Score:</strong> {data.topScore}</div>
            </div>

            {data.topToday && data.topToday.length > 0 && (
                <div className="accordion-section">
                    <div className="accordion-header" onClick={() => toggleSection('today')}>
                        <h3>Top Scores Today</h3>
                    </div>
                    {expandedSection === 'today' && (
                        <div className="accordion-content">
                            {renderScoreList(data.topToday)}
                        </div>
                    )}
                </div>
            )}

            {data.topThisWeek && data.topThisWeek.length > 0 && (
                <div className="accordion-section">
                    <div className="accordion-header" onClick={() => toggleSection('week')}>
                        <h3>Top Scores This Week</h3>
                    </div>
                    {expandedSection === 'week' && (
                        <div className="accordion-content">
                            {renderScoreList(data.topThisWeek)}
                        </div>
                    )}
                </div>
            )}

            {data.topThisMonth && data.topThisMonth.length > 0 && (
                <div className="accordion-section">
                    <div className="accordion-header" onClick={() => toggleSection('month')}>
                        <h3>Top Scores This Month</h3>
                    </div>
                    {expandedSection === 'month' && (
                        <div className="accordion-content">
                            {renderScoreList(data.topThisMonth)}
                        </div>
                    )}
                </div>
            )}

            {data.topThisYear && data.topThisYear.length > 0 && (
                <div className="accordion-section">
                    <div className="accordion-header" onClick={() => toggleSection('year')}>
                        <h3>Top Scores This Year</h3>
                    </div>
                    {expandedSection === 'year' && (
                        <div className="accordion-content">
                            {renderScoreList(data.topThisYear)}
                        </div>
                    )}
                </div>
            )}

            {data.topAllTime && data.topAllTime.length > 0 && (
                <div className="accordion-section">
                    <div className="accordion-header" onClick={() => toggleSection('allTime')}>
                        <h3>Top Scores All Time</h3>
                    </div>
                    {expandedSection === 'allTime' && (
                        <div className="accordion-content">
                            {renderScoreList(data.topAllTime)}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Home;