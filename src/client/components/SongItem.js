import React from 'react';
import '../styles/Library.css';

const SongItem = ({_id, title, artist, album, duration, genre, onClick, nowPlayingID}) => (
	<div className="listItem" onClick={onClick}>
		<p className="title"><i className="fas fa-music"></i>  {title}</p>
		{nowPlayingID === _id ? <img class="nowPlayingInd" src="https://img.icons8.com/windows/52/000000/audio-wave.png" />:""}
		<p className="artist"><i className="fas fa-user"></i>  {artist}</p>
		<p className="album"><i className="fas fa-compact-disc"></i>  {album}</p>
	</div>
);


export default SongItem;