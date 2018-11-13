import React from 'react';

const NowPlaying = ({title, artist, album}) => {
		return (
			<div className="nowPlaying">
				<p className="title"><i className="fas fa-music"></i>  {title}</p>
				<p className="artist"><i className="fas fa-user"></i>  {artist}</p>
				<p className="album"><i className="fas fa-compact-disc"></i>  {album}</p>
			</div>
		)
}

export default NowPlaying;