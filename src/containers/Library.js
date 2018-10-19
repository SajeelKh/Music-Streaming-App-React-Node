import React,{Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../actions';
import Playlist from '../components/Playlist';
import {getSongs} from '../reducers';
import '../styles/Library.css';

class Library extends Component{
	constructor(props){
		super(props);
		this.fetchData = this.fetchData.bind(this);
	}

	componentDidMount(){
		this.fetchData();
	}

	componentDidUpdate(prevProps){
		
	}

	fetchData(){
		const {fetchSongs} = this.props;
		fetchSongs();
	}

	render(){
		const {songs, playSong} = this.props;

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

const mapStateToProps = (state) => {
	return {
		songs: getSongs(state),
	}
}

// const mapDispatchToProps = () => {

// }

Library = connect(mapStateToProps,actions)(Library);

export default Library;