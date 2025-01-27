import React from 'react';
import './player.css';

function getColorForName(name = '') {
	let hash = 0;
	for (let i = 0; i < name.length; i++) {
		hash = name.charCodeAt(i) + ((hash << 5) - hash);
	}
	const hue = Math.abs(hash) % 360;
	return `hsl(${hue}, 70%, 50%)`;
}

function getSvgDataUrl(playerName = '') {
	const letter = playerName.charAt(0).toUpperCase() || '?';
	const bgColor = getColorForName(playerName);

	const svg = `
	<svg xmlns="http://www.w3.org/2000/svg"
		 width="50"
		 height="50"
		 style="border-radius: 50%;">
	  <rect x="0" y="0" width="100%" height="100%" fill="${bgColor}" />
	  <text x="50%"
			y="50%"
			fill="#fff"
			font-size="24"
			dy=".35em"
			text-anchor="middle"
			font-family="Arial, sans-serif"
			font-weight="bold">
		${letter}
	  </text>
	</svg>
  `;
	return 'data:image/svg+xml;base64,' + btoa(svg);
}

function PlayerIcon({ player, offline = false, selectable = false, selected = false, onToggleSelect = () => { } }) {

	const avatarUrl = player?.avatar?.url
		? player.avatar.url
		: getSvgDataUrl(player?.name);

	return (
		<button
			className="player-icon"
			onClick={onToggleSelect}
			disabled={!selectable}
		>
			{player && (
				<>
					<img
						src={avatarUrl}
						alt={player.name}
						className={
							"avatar " +
							(player.status?.toLowerCase() || "") +
							(selectable && selected ? " selected" : "") +
							(selectable && !selected ? " not-selected" : "") +
							(offline ? " offline" : "")
						}
					/>
					<figcaption className="player-name">{player.name}</figcaption>
				</>
			)}
		</button>
	);
}

export default PlayerIcon;
