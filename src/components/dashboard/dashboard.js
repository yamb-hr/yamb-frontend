import { useContext, useEffect, useState } from "react";
import { ErrorContext } from "../../App";
import ScoreService from "../../api/score-service";
import "./dashboard.css";

function Dashboard() {

    const [ activeTab, setActiveTab ] = useState('topAllTime');
    const [ tabs ] = useState(['topAllTime', 'topThisYear', 'topThisMonth', 'topThisWeek', 'topToday']);
    const [ dashboardData, setDashboardData ] = useState(null);
    const [ tableData, setTableData ] = useState(null);
    const { handleError } = useContext(ErrorContext); 

    useEffect(() => {
        ScoreService.getDashboardData()
        .then(data => {
            console.log(data);
            setDashboardData(data);  
        }
        ).catch(error => {
            handleError(error);
        });
    }, []);

    useEffect(() => {
        if(dashboardData) {
            setTableData(dashboardData[activeTab]);
        }
    }, [activeTab, dashboardData]);

    return (
        <div className="dashboard">
            {dashboardData && <div>
                {tabs.map(tab => (
                    <button key={tab} className={"tab-button " + (activeTab === tab ? "active" : "")} onClick={() => setActiveTab(tab)}>{tab}</button>
                ))}
            </div>}
            {tableData && <table className="table">
                <thead>
                    <tr> 
                        <th>Rank</th>
                        <th>Player</th>
                        <th>Score</th>
                        {/* <th>Date</th> */}
                    </tr>
                </thead>
                <tbody>
                    {tableData.map((score, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{score.player.username}</td>
                            <td>{score.value}</td>
                            {/* <td><time dateTime={score.date}>{new Date(score.date).toLocaleString(language, localeStringFormat)}</time></td> */}
                        </tr>
                    ))} 
                </tbody>
            </table>}
        </div>
    )
}

export default Dashboard;