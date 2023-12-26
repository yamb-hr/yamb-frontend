import { useContext, useEffect, useState } from "react";
import { ErrorContext, LanguageContext } from "../../App";
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import PlayerService from "../../api/player-service";
import GameService from "../../api/game-service";
import ScoreService from "../../api/score-service";
import "./table.css";

function Table() {

    const location = useLocation();
    const navigate = useNavigate();   
    const { handleError } = useContext(ErrorContext);
    const { language } = useContext(LanguageContext);
    const [ tableState, setTableState ] = useState({
        data: null,
        size: 10,
        page: 0,
        order: 'id',
        direction: 'asc'
    });

    const localeStringFormat = {
        year: 'numeric', month: 'long', day: 'numeric'
    }
    
    useEffect(() => {
        switch (location.pathname) {
            case '/players':
                PlayerService.getPlayers(tableState.size, tableState.page, tableState.order, tableState.direction)
                .then(data => {
                    console.log(data);
                    setTableState(prevState => ({...prevState, data: data}));
                })
                .catch(error => {
                    handleError(error);
                });
                break;
            case '/games':
                GameService.getGames(tableState.size, tableState.page, tableState.order, tableState.direction)
                .then(data => {
                    console.log(data);
                    setTableState(prevState => ({...prevState, data: data}));
                })
                .catch(error => {
                    handleError(error);
                });
                break;
            case '/scores': 
                ScoreService.getScores(tableState.size, tableState.page, tableState.order, tableState.direction)
                .then(data => {
                    console.log(data);
                    setTableState(prevState => ({...prevState, data: data}));
                })
                .catch(error => {
                    handleError(error);
                });
                break;
            default:
                break;
        }
    }, [tableState.direction, tableState.order, tableState.page, tableState.size]);

    function handleSizeChange(event) {
        setTableState(prevState => ({...prevState, size: event.target.value, page: 0}));
    }

    return(
        <div>
            {tableState.data && <table className="table">
                <thead>
                    <tr> 
                        {tableState.data[0] && [...Object.keys(tableState.data[0])]?.map((field, index) => {
                            if (!Array.isArray(tableState.data[0][field]) && typeof(tableState.data[0][field]) !== 'object') {
                                return <th key={index} onClick={() => {setTableState(prevState => ({...prevState, order: field, direction: 'desc'}))}}>{field}</th>
                            }
                            return null;
                        })} 
                    </tr>
                </thead>
                <tbody>
                    {tableState.data.map((element, index) => (
                        <tr key={index} onClick={() => {navigate(location.pathname + "/" + element['id'])}}>
                            {[...Object.keys(element)]?.map((field, index) => {
                                if (!Array.isArray(element[field]) && typeof(element[field]) !== 'object') {
                                    if (field === 'date') {
                                        return <td key={index}><time dateTime={element[field]}>{new Date(element[field]).toLocaleString(language, localeStringFormat)}</time></td>
                                    } else {
                                        return <td key={index}>{element[field]}</td>
                                    }
                                }
                                return null;
                            })} 
                        </tr>
                    ))} 
                </tbody>
            </table>}
            <br/>
            <div>
                <button onClick={() => {setTableState(prevState => ({...prevState, page: tableState.page - 1 }))}} disabled={tableState.page === 0} className="page-control">{"<"}</button>
                &nbsp;&nbsp;{tableState.page}&nbsp;&nbsp;
                <button onClick={() => {setTableState(prevState => ({...prevState, page: tableState.page + 1 }))}} disabled={tableState.data && tableState.data.length < tableState.size} className="page-control">{">"}</button>
            </div>  
            <br/>
            <label>Rows per page: </label>
            <select value={tableState.size} onChange={handleSizeChange}>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
            </select>
        </div>
    )
}

export default Table;