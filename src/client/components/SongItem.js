import React from 'react';
import '../styles/Library.css';

const SongItem = ({_id, title, artist, album, duration, genre, onClick, nowPlayingID}) => (
	<div className="listItem" onClick={onClick}>
		<p className="title"><i className="fas fa-music"></i>  {title}</p>
		<p className="artist"><i className="fas fa-user"></i>  {artist}</p>
		<p className="album"><i className="fas fa-compact-disc"></i>  {album}</p>
		{nowPlayingID === _id ? <i class="fas fa-volume-up nowPlayingInd"></i>:""}
	</div>
);


export default SongItem;