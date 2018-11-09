import React from 'react';

const Audio = ({isPlaying, source}) => {
	console.log(source);
	return (
		<audio src={source} controls />
	);
}

export default Audio;