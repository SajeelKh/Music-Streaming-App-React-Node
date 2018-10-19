import {combineReducers} from 'redux';

const songs = (state={}, action) => {
	switch(action.type){
		case 'RECEIVE_SONGS':
			const nextState = {...state};
			action.response.forEach(song => {
				nextState[song.id] = song;
			});
			return nextState;
		default:
			return state;
	}
}

const allIds = (state = [], action) => {
	switch(action.type){
		case 'RECEIVE_SONGS':
			return action.response.map(song => song.id);
		default:
			return state;
	}
} 

const nowPlaying = (state = {}, action) => {
	switch(action.type){
		case 'PLAY_SONG':
			return action.getState.songs[action.id];
		default:
			return state;
	}
}

const getAllSongs = (state) => {
	return state.allIds.map(id => state.songs[id]);
}

export const getSongs = (state) => {
	return getAllSongs(state);
}

export const getNowPlaying = (state) => {
	return state.nowPlaying;
}

export default combineReducers({
	songs,
	allIds,
	nowPlaying,
});