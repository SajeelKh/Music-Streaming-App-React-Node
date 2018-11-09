import * as api from '../api';
import axios from 'axios';

const receiveSongs = (filter, response) => ({
	type: 'RECEIVE_SONGS',
	filter: filter,
	response
})

const requestSongs = (filter) => ({
	type: 'REQUEST_SONGS',
	filter: filter,
})

export const fetchSongs = (filter) => (dispatch) => {
	dispatch(requestSongs(filter));

	axios.get('http://127.0.0.1:3005/tracks').then(response =>
		dispatch(receiveSongs(filter, response))
	).catch(err =>
		console.log(err)
	);
}

export const playSong = (id) => (dispatch, getState) => {
	dispatch({
		type: 'PLAY_SONG',
		id,
		getState: getState(),
	})
}