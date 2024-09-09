import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CurrentUserContext, ErrorContext } from '../../App';
import authService from '../../services/authService';
import gameService from '../../services/gameService';
import { calculateScore } from '../../util/scoreCalculator';
import Game from './game/game';
import './yamb.css';

function Yamb() {

    const { id } = useParams();
    const { t } = useTranslation();
    const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
    const { handleError } = useContext(ErrorContext);
    const [ game, setGame ] = useState(null);
    const [ isShareModalVisible, setShareModalVisible ] = useState(false);

    useEffect(() => {   
        if (id) {
            gameService.getById(id)
            .then((data) => {
                setGame(data);
            })
            .catch((error) => {
                handleError(error)
            });
        } else if (currentUser) {
            gameService.getOrCreate()
            .then((data) => {
                setGame(data);
                if (data.status === "COMPLETED") {
                    setShareModalVisible(true);
                }
            })
            .catch((error) => {
                handleError(error);
                if (error?.response?.data?.status === 401) {
                    setCurrentUser(null);
                    authService.logout();
                }
            });
        }
    }, [currentUser, id]);

    function handleRoll(diceToRoll) {
        console.time("roll");
        gameService.rollById(game.id, diceToRoll)
        .then((data) => {
            console.timeEnd("roll");
            let newGame = {...data};
            setGame(newGame);
        })
        .catch((error) => {
            handleError(error)
        });
    };

    function handleFill(columnType, boxType) {
        console.time("fill");
        let diceValues = game.dices.map((dice) => dice.value);
        let newGame = {...game};
        const columnIndex = newGame.sheet.columns.findIndex(c => c.type === columnType);
        const boxIndex = newGame.sheet.columns[columnIndex].boxes.findIndex(b => b.type === boxType);
        let value = calculateScore(diceValues, boxType);
        newGame.sheet.columns[columnIndex].boxes[boxIndex].value = value;
        setGame(newGame);
        gameService.fillById(
            game.id, columnType, boxType
        )
        .then((data) => {
            console.timeEnd("fill");
            let newGame = {...data};
            setGame(newGame);
            if (data.status === "COMPLETED") {
                setShareModalVisible(true);
            }
        })
        .catch((error) => {
            handleError(error)
        });
    }

    function handleAnnounce(type) {
        console.time("announce");
        gameService.announceById(
            game.id, type
        )
        .then((data) => {
            console.timeEnd("announce");
            let newGame = {...data};
            setGame(newGame);
        })
        .catch((error) => {
            handleError(error)
        });

    }

    function handleRestart() {       
        console.time("restart");
        gameService.restartById(
            game.id
        )
        .then((data) => {
            console.timeEnd("restart");
            setGame(data);
        })
        .catch((error) => {
            handleError(error)
        });
    }

    function handleArchive() {
        gameService.archiveById(
            game.id
        )
        .then((data) => {
            window.location.reload();
        })
        .catch((error) => {
            handleError(error)
        });
    }

    const handleShare = () => {
        const shareText = `I scored ${game.totalSum} points in Yamb! Can you beat my score?`;
        
        if (navigator.share) {
            navigator.share({
                title: 'My Yamb Score',
                text: shareText,
                url: `/games/${game.id}`
            }).then(() => {
                console.log('Score shared successfully!');
            }).catch((error) => {
                console.error('Error sharing the score:', error);
            });
        } else {
            navigator.clipboard.writeText(shareText).then(() => {
                alert('Score copied to clipboard!');
            });
        }
    };
   
    return (
        <div className="yamb">
            <div className={`share-modal ${isShareModalVisible ? 'show' : ''}`}>
                <img src="/logo.png" alt="Yamb" className="share-logo" />
                <h2>{t("congrats")}</h2>
                <p>{t("congrats-score")}</p>
                {game && <h2>{game.totalSum}</h2>}
                <button className="share-button" onClick={() => handleShare()}>
                    {t("share-score")}
                </button>
                <hr/>
                <p>{t("want-to-try-again")}</p>
                <button className="new-game-button" onClick={() => handleArchive()}>
                    {t("new-game")}
                </button>
                <button className="close-button" onClick={() => setShareModalVisible(false)}>
                    X
                </button>
            </div>
            <div className={`share-modal-shadow ${isShareModalVisible ? 'show' : ''}`} onClick={() => setShareModalVisible(false)}></div>
            {game && <Game 
                sheet={game.sheet}
                dices={game.dices}
                rollCount={game.rollCount}
                announcement={game.announcement}
                status={game.status}
                playerId={game.playerId}
                onRoll={handleRoll}
                onFill={handleFill}
                onAnnounce={handleAnnounce}
                onRestart={handleRestart}>
            </Game>}
        </div>
    );
};

export default Yamb;

