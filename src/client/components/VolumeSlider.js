import React from 'react';

const VolumeSlider = ({changeVolume, toggleMute, muted, toggleLoop, looping, shuffle, toggleShuffle}) => {

	const handleVolumeChange = (event) => {
		changeVolume(event.target.value);
	}

	const handleVolumeClick = (event) => {
		toggleMute();
	}

	const handleLoopClick = (event) => {
		toggleLoop();
	}

	return (
		<div class="volumeSliderWrapper">
			<a className={shuffle?"shuffleButton shuffleButtonActive":"shuffleButton"} onClick={toggleShuffle}><i className="fas fa-random"></i></a>
			<a className={looping?"loopButton loopButtonActive":"loopButton"} onClick={handleLoopClick}><i class="fas fa-undo-alt"></i></a>
			<div className="volume">
				<a className="volumeButton" onClick={handleVolumeClick}><i class={muted?"fas fa-volume-off":"fas fa-volume-up"}></i></a>
				<input id="volumeSlider" type="range" min='0' max='1' step='0.1' onInput={handleVolumeChange} />
			</div>
		</div>
	);
}

export default VolumeSlider;