import React from 'react';
import SongItem from './SongItem';
import '../styles/Library.css';

const Playlist = ({songs, filter, search, onClickSong}) => {
	const playlist = songs.map(song =>
		<SongItem
			key={song.id}
			{...song}
			onClick={()=>onClickSong(song.id)}
		/>
	)

	return (
		<div className="playlist">
			{playlist}
		</div>
	);

}

export default Playlist;