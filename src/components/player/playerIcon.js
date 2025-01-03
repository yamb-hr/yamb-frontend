import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './player.css';

function PlayerIcon({player, selected = false, onToggleSelect = () => {}}) {

    return (
        <div className="player-icon" onClick={onToggleSelect}>
            {player && (<>
                <img
                    src={player.avatar?.url ?? '/img/avatar.png'}
                    alt={player.name}
                    className="avatar"
                />
                <figcaption className="player-name">{selected && <><span className="icon">&#10004;</span>&nbsp;</>}{player.name}</figcaption>
            </>)} 
        </div>
    );
}

export default PlayerIcon;
