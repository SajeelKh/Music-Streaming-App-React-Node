import React, {Component} from 'react';

const PlayButton = ({isPlaying, onClick}) => {
	// const handleShuffleClick
	
	return (
		<div>
			<button 
				className="PlayButton"
				onClick={onClick}
			>
					{isPlaying?<i className="fas fa-pause"></i>:<i className="fas fa-play"></i>}
			</button>
		</div>
	);

}

export default PlayButton;