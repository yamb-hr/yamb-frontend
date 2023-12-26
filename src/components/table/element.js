import { useContext, useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { ErrorContext, LanguageContext } from '../../App';
import PlayerService from '../../api/player-service';
import ScoreService from '../../api/score-service';


function Element() {

    const { id } = useParams();
    const location = useLocation();
    const { language } = useContext(LanguageContext);
    const { handleError } = useContext(ErrorContext);
    const [ data, setData ] = useState(null);

    const localeStringFormat = {
        year: 'numeric', month: 'long', day: 'numeric', dayofweek: 'long', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false
    }

    useEffect(() => {
        switch (location.pathname.split('/')[1]) {
            case 'players':
                PlayerService.getPlayerById(id)
                .then(data => {
                    console.log(data);
                    setData(data);
                })
                .catch(error => {
                    handleError(error);
                });
                break;
            case 'scores': 
                ScoreService.getScoreById(id)
                .then(data => {
                    console.log(data);
                    setData(data);
                })
                .catch(error => {
                    handleError(error);
                });
                break;
            default:
                break;
        }
    }, [id]);

    return (
        <div className="element">
            {data && [...Object.keys(data)].map((field, index) => {
                if (!Array.isArray(data[field]) && typeof(data[field]) !== 'object') {
                    if (field === 'date') {
                        return <div key={index}><time dateTime={data[field]}>{new Date(data[field]).toLocaleString(language, localeStringFormat)}</time></div>
                    } else {  
                        return <div key={index}>{field}: {data[field]}</div>
                    }
                }
                return null;
            })}
        </div>
    )
}

export default Element;