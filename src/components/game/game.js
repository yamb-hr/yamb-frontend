import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { CurrentUserContext } from '../../providers/currentUserProvider';
import { StompClientContext } from '../../providers/stompClientProvider';
import { ToastContext } from '../../providers/toastProvider';
import { ErrorContext } from '../../providers/errorProvider';
import scoreCalculator from '../../util/scoreCalculator';
import gameService from '../../services/gameService';
import Sheet from './sheet/sheet';
import Dice from './dice/dice';
import './game.css';
import { init } from 'i18next';

const DEFAULT_DICE = [0, 1, 2, 3, 4];

function Game({ id: propId }) {

	const { id: urlId } = useParams();
	const id = urlId || propId;
	const { t } = useTranslation();
	const { showInfoToast } = useContext(ToastContext);
	const { currentUser } = useContext(CurrentUserContext);
	const { stompClient, isConnected } = useContext(StompClientContext);
	const { handleError } = useContext(ErrorContext);

	const [game, setGame] = useState(null);
	const [subscribed, setSubscribed] = useState(false);
	const [fill, setFill] = useState(null);
	const [restart, setRestart] = useState(false);
	const [diceToRoll, setDiceToRoll] = useState(DEFAULT_DICE);
	const [isRolling, setRolling] = useState(false);
	const [modalShowing, setModalShowing] = useState(false);

	const everythingDisabled = currentUser?.id !== game?.player.id;
	const rollCount = game?.rollCount || 0;
	const diceDisabled = everythingDisabled || rollCount === 0 || rollCount === 3 || game?.status !== 'IN_PROGRESS';

	useEffect(() => {
		if (game?.status === 'COMPLETED') handleShareModal();
	}, [game]);

	useEffect(() => {
		if (!game && id) {
			gameService.getById(id).then(setGame).catch(handleError);
			setSubscribed(true);
		} else if (!game && currentUser) {
			gameService.getOrCreate(currentUser.id).then((data) => {
				setGame(data);
				if (data.status === 'COMPLETED') handleShareModal();
			}).catch(handleError);
		}
	}, [currentUser, id]);

	const handleSubscribe = () => {
        setSubscribed(!subscribed);
    };

	useEffect(() => {
        if (id && stompClient && isConnected && subscribed) {
            const subscription = stompClient.subscribe(`/topic/games/${id}`, onGameAction);
            return () => subscription.unsubscribe();
        }
    }, [id, stompClient, isConnected, subscribed]);

	useEffect(() => {
		if (restart) {
			handleRestart();
			setRestart(false);
		}
	}, [restart]);

	useEffect(() => {
		if (fill) {
			handleFill(fill.columnType, fill.boxType);
			setFill(null);
		}
	}, [fill]);

	const onGameAction = (message) => {
        const gameData = JSON.parse(message.body).content;
        setGame(gameData);

        if (gameData.action === 'ROLL') {
            initiateRollAnimation();
        }
    };

	const initiateRollAnimation = () => {
        setRolling(true);
        setTimeout(() => {
            setRolling(false);
        }, 500);
    };

	const handleRoll = () => {
		initiateRollAnimation();
        gameService.rollById(game, diceToRoll)
            .then((data) => {
                setGame(data);
            })
            .catch(handleError);
    };

	const handleFill = (columnType, boxType) => {
		const diceValues = game.dices.map(dice => dice.value);
		const columnIndex = game.sheet.columns.findIndex(c => c.type === columnType);
		const boxIndex = game.sheet.columns[columnIndex].boxes.findIndex(b => b.type === boxType);
		const value = scoreCalculator.calculateScore(diceValues, boxType);
		game.sheet.columns[columnIndex].boxes[boxIndex].value = value;

		gameService.fillById(game, columnType, boxType).then((data) => {
			setGame(data);
			if (data.status === 'COMPLETED') handleShareModal();
		}).catch(handleError);
	};

	const handleAnnounce = (type) => {
		gameService.announceById(game, type).then(setGame).catch(handleError);
	};

	const showRestartPrompt = () => {
		showInfoToast(
			<div>
				{t('confirm-restart')}
				<div className="restart-prompt">
					<button className="restart-prompt-button button-yes" onClick={() => setRestart(true)}>{t('yes')}</button>
					<button className="restart-prompt-button button-no" onClick={() => toast.dismiss()}>{t('no')}</button>
				</div>
			</div>
		);
	};

	const handleRestart = () => {
		gameService.restartById(game).then(setGame).catch(handleError);
		setDiceToRoll(DEFAULT_DICE);
	};

	const handleArchive = () => {
		gameService.archiveById(game).then(() => window.location.reload()).catch(handleError);
	};

	const handleDiceClick = (index) => {
		setDiceToRoll((prev) => prev.includes(index) ? prev.filter(dice => dice !== index) : [...prev, index]);
	};

	const handleBoxClick = (columnType, boxType) => {
		if (columnType === 'ANNOUNCEMENT' && game.announcement == null) {
			handleAnnounce(boxType);
		} else {
			setFill({ columnType, boxType });
			setDiceToRoll(DEFAULT_DICE);
		}
	};

	const handleShareModal = () => {
		if (!modalShowing) {
			setModalShowing(true);
			let autoClose = 99999;
			showInfoToast(
				<div>
					<img src="/logo.png" alt="Yamb" className="share-logo" />
					<h2>{t("congrats")}</h2>
					<p>{t("congrats-score")}</p>
					{game && <h2>{game.totalSum}</h2>}
					<button className="share-button" onClick={handleShare}>{t("share-score")}</button>
					<hr />
					<p>{t("want-to-try-again")}</p>
					<button className="new-game-button" onClick={handleArchive}>{t("new-game")}</button>
				</div>, autoClose
			);
			setTimeout(() => {
				setModalShowing(false)
			}, 99999)
		}
	};

	const handleShare = () => {
		if (navigator.share) {
			navigator.share({
				title: t('yamb'),
				text: t('share-score-text', { score: game.totalSum }),
				url: `/games/${game.id}`,
			}).catch(console.error);
		} else {
			alert("Your browser doesn't support the Web Share API.");
		}
	};

	return (
		<div className="game-container">
			{game && (
				<div>
					<div className="dices">
						{game.dices.map((dice, index) => (
							<Dice
								key={index}
								value={dice.value}
								index={dice.index}
								saved={!diceToRoll.includes(dice.index)}
								rollCount={rollCount}
								diceDisabled={diceDisabled}
								onDiceClick={handleDiceClick}
							/>
						))}
					</div>
					{game.sheet && (
						<Sheet
							columns={game.sheet.columns}
							rollCount={rollCount}
							announcement={game.announcement}
							status={game.status}
							dices={game.dices}
							player={game.player}
							diceToRoll={diceToRoll}
							subscribed={subscribed}
							isRolling={isRolling}
							onRoll={handleRoll}
							onRestart={showRestartPrompt}
							onBoxClick={handleBoxClick}
							onSubscribe={handleSubscribe}
						/>
					)}
				</div>
			)}
		</div>
	);
}

export default Game;
