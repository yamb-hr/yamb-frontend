import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './player.css';

function PlayerIcon({player, selectable = false, selected = false, onToggleSelect = () => {}}) {

    return (
        <button className="player-icon" onClick={onToggleSelect} disabled={!selectable}>
            {player && (<>
                <img
                    src={player.avatar?.url ?? '/img/avatar.png'}
                    alt={player.name}
                    className={"avatar " + player.status?.toLowerCase() + (selected ? " selected" : "")}
                />
                <figcaption className="player-name">{player.name}</figcaption>
            </>)} 
        </button>
    );
}

export default PlayerIcon;
