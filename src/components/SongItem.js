import React from 'react';
import '../styles/Library.css';

const SongItem = ({id, title, artist, album, duration, genre, onClick}) => (
	<div className="listItem" onClick={onClick}>
		<p className="title"><i className="fas fa-music"></i>  {title}</p>
		<p className="artist"><i className="fas fa-user"></i>  {artist}</p>
		<p className="album"><i className="fas fa-compact-disc"></i>  {album}</p>
	</div>
);


export default SongItem;