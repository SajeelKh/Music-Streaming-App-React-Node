import React from 'react';
import SongItem from './SongItem';
import '../styles/Library.css';

const Playlist = ({songs, filter, search, onClickSong, nowPlayingID}) => {
	console.log(nowPlayingID);
	const playlist = songs.map(song =>
		<SongItem
			key={song._id}
			{...song}
			onClick={()=>onClickSong(song._id)}
			nowPlayingID={nowPlayingID}
		/>
	)

	return (
		<div className="playlist">
			{playlist}
		</div>
	);

}

export default Playlist;