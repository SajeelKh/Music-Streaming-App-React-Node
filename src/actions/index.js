import * as api from '../api'

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

	api.fetchSongs().then(response=>
		dispatch(receiveSongs(filter, response))
	);
}

export const playSong = (id) => (dispatch, getState) => {
	dispatch({
		type: 'PLAY_SONG',
		id,
		getState: getState(),
	})
}