import React,{Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../actions';
import Playlist from '../components/Playlist';
import ArtistList from '../components/ArtistList';
import {getSongs} from '../reducers';
import {withRouter} from 'react-router-dom';
import '../styles/Library.css';

class Library extends Component{
	constructor(props){
		super(props);
	}

	componentDidMount(){
		this.fetchData();
	}

	componentDidUpdate(prevProps){
		
	}

	fetchData = () => {
		const {fetchSongs} = this.props;
		fetchSongs();
	}
	
	getAllArtists = (songs) => {
		return songs.map(song => {
			return song.artist;
		});
	}

	getSongsByArtists = (artistList, songs) => {
		var songsByArtists = {};
		artistList.forEach(artist => {
			songsByArtists = {...songsByArtists, [artist]: []}
		});

		songs.forEach(song => {
			songsByArtists[song.artist] = [...songsByArtists[song.artist], song];
		});

		return songsByArtists;

	}

	render(){
		const {filter, search, songs, playSong} = this.props;
		const artistList = this.getAllArtists(songs);
		const songsByArtist = this.getSongsByArtists(artistList, songs);
		
		// if(filter === 'all'){
		// 	return (
		// 		<div className="library-wrapper">
		// 			<div className="library">
		// 				<Playlist
		// 					songs={songs}
		// 					onClickSong={playSong}
		// 				/>
		// 			</div>
		// 		</div>
		// 	);
		// }
		if(filter === 'artist'){
			return (
				<div className="library-wrapper">
					<div className="artistList">
						<ArtistList
							artistList={artistList}
							songsByArtist={songsByArtist}
						/>
					</div>
				</div>
			);
		}

		else {
			return (
				<div className="library-wrapper">
					<div className="library">
						<Playlist
							songs={songs}
							onClickSong={playSong}
						/>
					</div>
				</div>
			);
		}
	}
}

const mapStateToProps = (state, {match}) => {
	const filter = match.params.filter || 'all';
	const search = match.params.search;
	return {
		songs: getSongs(state),
		filter,
		search,
	}
}

// const mapDispatchToProps = () => {

// }

Library = withRouter(connect(
	mapStateToProps,
	actions,
)(Library));

export default Library;