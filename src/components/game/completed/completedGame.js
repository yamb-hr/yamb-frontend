import React from 'react';
import { useTranslation } from 'react-i18next';
import './completedGame.css';

function CompletedGame(props) {

    const { t } = useTranslation();

    const handleShare = () => {
		props.onShare();
	};

	const handleArchive = () => {
        props.onArchive();
	};

    return (
        <div className="completed-game">
            <img src="/logo.png" alt="Yamb" className="share-logo" />
            <h2>{t("congrats")}</h2>
            <p>{t("congrats-score")}</p>
            <h2>{props.value}</h2>
            <div className="button-container">
                <button className="share-button" onClick={handleShare}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20">
                        <circle cx="18" cy="5" r="3" fill="currentColor"/>
                        <circle cx="18" cy="19" r="3" fill="currentColor"/>
                        <circle cx="6" cy="12" r="3" fill="currentColor"/>
                        <line x1="18" y1="5" x2="6" y2="12" stroke="currentColor" strokeWidth="2"/>
                        <line x1="18" y1="19" x2="6" y2="12" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    &nbsp;{t("share")}
                </button>
            </div>
            <hr />
            <p>{t("want-to-try-again")}</p>
            <div className="button-container">
                <button className="new-game-button" onClick={handleArchive}>{t("new-game")}</button>
            </div>
        </div>
    );
}

export default CompletedGame;
