import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { ToastContext } from '../../providers/toastProvider';
import { InGameContext } from '../../providers/inGameProvider';
import { CurrentUserContext } from '../../providers/currentUserProvider';
import { StompClientContext } from '../../providers/stompClientProvider';
import { ErrorHandlerContext } from '../../providers/errorHandlerProvider';
import scoreCalculator from '../../util/scoreCalculator';
import gameService from '../../services/gameService';
import Sheet from './sheet/sheet';
import Dice from './dice/dice';
import './game.css';

const DEFAULT_DICE = [0, 1, 2, 3, 4];

function Game(props) {

	const { id: urlId } = useParams();
    const id = props?.id || urlId;
	const { t } = useTranslation();

	const { setInGame } = useContext(InGameContext);
	const { showInfoToast } = useContext(ToastContext);
	const { currentUser } = useContext(CurrentUserContext);
	const { handleError } = useContext(ErrorHandlerContext);
	const { stompClient, isConnected } = useContext(StompClientContext);

	const [game, setGame] = useState(null);
	const [subscribed, setSubscribed] = useState(false);
	const [fill, setFill] = useState(null);
	const [restart, setRestart] = useState(false);
	const [diceToRoll, setDiceToRoll] = useState(DEFAULT_DICE);
	const [isRolling, setRolling] = useState(false);
	const [modalShowing, setModalShowing] = useState(false);

	const isSpectator = currentUser?.id !== game?.player?.id;
	const rollCount = game?.rollCount || 0;
	const diceDisabled = isSpectator || rollCount === 0 || rollCount === 3 || game?.status !== 'IN_PROGRESS';

	useEffect(() => {
		if (game?.status === 'COMPLETED' && game?.type !== "CLASH") handleShareModal();
	}, [game]);

	useEffect(() => {
		setInGame(true);
		return () => {
		  	setInGame(false);
		};
	}, [setInGame]);

	useEffect(() => {
		if (!game && id || (game?.id !== id)) {
			gameService.getById(id).then(setGame).catch(handleError);
			setSubscribed(true);
		} else if (!game && currentUser) {
			gameService.getOrCreate(currentUser.id).then(setGame).catch(handleError);
		}
	}, [currentUser, id]);

	const handleSubscribe = () => {
        setSubscribed(!subscribed);
    };

	useEffect(() => {
        if (id && stompClient && isConnected && subscribed && isSpectator) {
            const subscription = stompClient.subscribe(`/topic/games/${id}`, onGameUpdate);
            return () => subscription.unsubscribe();
        }
    }, [id, stompClient, isConnected, subscribed, isSpectator]);

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

	const onGameUpdate = (message) => {
		const body = JSON.parse(message.body);
		let updatedGame = body.payload;
		setGame(updatedGame);
		if (updatedGame.lastAction === 'ROLL') {
			setDiceToRoll(updatedGame.latestDiceRolled);
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
        gameService.rollById(game, diceToRoll).then(setGame).catch(handleError);
    };

	const handleFill = (columnType, boxType) => {
		const diceValues = game.dices.map(dice => dice.value);
		const columnIndex = game.sheet.columns.findIndex(c => c.type === columnType);
		const boxIndex = game.sheet.columns[columnIndex].boxes.findIndex(b => b.type === boxType);
		const value = scoreCalculator.calculateScore(diceValues, boxType);
		game.sheet.columns[columnIndex].boxes[boxIndex].value = value;

		gameService.fillById(game, columnType, boxType).then(data => {
			setGame(data);
			if (data.status === 'COMPLETED' && data.type !== "CLASH") {
				handleShareModal();
			}
		}).catch(handleError);
	};

	const handleUndoFill = () => {
		gameService.undoFillById(game).then((data) => {
			setGame(data);
		}).catch(handleError);
	}

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
		if (!modalShowing && !isSpectator) {
			setModalShowing(true);
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
				</div>, 999999
			);
		}
	};

	const handleShare = () => {
		if (navigator.share) {
			navigator.share({
				title: t('yamb'),
				text: t('share-score-text', { score: game.totalSum }),
				url: `/games/${id}`,
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
								saved={!diceToRoll.includes(dice.index) || (isSpectator && rollCount > 0 && !game.latestDiceRolled?.includes(dice.index))}
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
							latestColumnFilled={game.latestColumnFilled}
							latestBoxFilled={game.latestBoxFilled}
							type={game.type}
							subscribed={subscribed}
							isRolling={isRolling}
							isSpectator={isSpectator}
							onRoll={handleRoll}
							onRestart={showRestartPrompt}
							onBoxClick={handleBoxClick}
							onSubscribe={handleSubscribe}
							onUndoFill={handleUndoFill}
						/>
					)}
				</div>
			)}
		</div>
	);
}

export default Game;
