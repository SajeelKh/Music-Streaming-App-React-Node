import React, {Component} from 'react';
import {connect} from 'react-redux';
import axios from 'axios';
import {getNowPlaying} from '../reducers';
import SeekSlider from '../components/SeekSlider';
import NowPlaying from '../components/NowPlaying';
import PlayButton from '../components/PlayButton';
// import Audio from '../components/Audio';
import '../styles/MusicBar.css';

class MusicBar extends Component {
	constructor(props){
		super(props);
		this.state = {
			isPlaying: false,
			nowPlayingURL: null,
			volume: 50,
			position: 0,
		}
		this.Audio = new Audio();
		this.audioPlayer
		this.timer = null;
		this.PlayButtonHandler = this.PlayButtonHandler.bind(this);
		this.getNowPlayingURL = this.getNowPlayingURL.bind(this);
	}

	componentDidUpdate(prevProps){
		if(!this.state.isPlaying){
			clearInterval(this.timer);
		}

		if(prevProps.nowPlaying._id !== this.props.nowPlaying._id){
			this.setState(()=>({
				nowPlayingURL: this.getNowPlayingURL(),
			}));

			clearInterval(this.timer);
		}


	}

	componentWillReceiveProps(nextProps){
		if(nextProps.nowPlaying._id !== this.props.nowPlaying._id){
			this.setState((prevState) => ({
				isPlaying : !prevState,
			}));
		}
	}

	PlayButtonHandler(){
		console.log('src: ',this.Audio.src);
		if(this.Audio.src){
			this.setState((prevState) => ({
				isPlaying : !prevState.isPlaying
			}));

			if(this.state.isPlaying){
				this.Audio.pause();
			}
			else{
				this.Audio.play();
				this.timer = setInterval(() => {
					this.setState((prevState) => ({
						position: this.Audio.currentTime,
					}))
				},1000);
			}
		}
	}

	getNowPlayingURL(){
		if(Object.keys(this.props.nowPlaying).length === 0 && this.props.nowPlaying.constructor === Object){
			return null;
		}
		else{
			this.Audio.src = `http://localhost:3005/tracks/${this.props.nowPlaying._id}`;
			return `http://localhost:3005/tracks/${this.props.nowPlaying._id}`;
		}
	}

	remainingTime(){
		let currTime;
		if(this.Audio){
			currTime = this.Audio.currentTime;
			return currTime;
		}
		else{
			return 0;
		}
	}

	render(){
		const {nowPlaying} = this.props;
		const duration = this.props.nowPlaying.duration || 0;
		const songId = this.props.nowPlaying.id;

		return (
			<div className="musicbar-wrapper">
				<div className="MusicBar">
					{/*<Audio 
						source={this.state.nowPlayingURL}
					/>*/}
					<SeekSlider
						song = {songId}
						duration={duration} 
						isPlaying = {this.state.isPlaying}
						remainingTime = {this.remainingTime()}
					/>
					<NowPlaying
						{...nowPlaying}
					/>
					<PlayButton
						song = {songId}
						isPlaying = {this.state.isPlaying}
						onClick = {this.PlayButtonHandler}
					/>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		nowPlaying: getNowPlaying(state),
	}
}

MusicBar = connect(mapStateToProps,)(MusicBar);

export default MusicBar;