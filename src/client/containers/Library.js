import React,{Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../actions';
import Playlist from '../components/Playlist';
import ArtistList from '../components/ArtistList';
import {getSongs, getNowPlaying} from '../reducers';
import {Route, withRouter, Switch} from 'react-router-dom';
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
		console.log("ID: ", this.props.nowPlayingID);
		return (
			<div className="library-wrapper">
				<Switch>
					<Route path='/all' render={() => (
						<div className="library">
							<Playlist
								songs={songs}
								onClickSong={playSong}
								nowPlayingID={this.props.nowPlayingID}
							/>
						</div>)}
						/>

					<Route exact path='/artist' render={() => (
						<div className="artistList">
							<ArtistList
								artistList={artistList}
								songsByArtist={songsByArtist}
								onClickSong={playSong}
							/>
						</div>)}
						/>

					<Route path='/artist/:name' render={() => (
						<div className="library">
							<Playlist
								songs={this.props.location.state.songs}
								onClickSong={playSong}
							/>
						</div>
					)}
					/>
				</Switch>
		 	</div>
		);
	}
}

const mapStateToProps = (state, {match}) => {
	const filter = match.params.filter || 'all';
	const search = match.params.search;
	return {
		songs: getSongs(state),
		nowPlayingID: getNowPlaying(state)._id || 0,
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