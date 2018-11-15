import React, {Component} from 'react';
import {connect} from 'react-redux';
import axios from 'axios';
import {getNowPlaying, getSongs} from '../reducers';
import { playSong } from '../actions';
import SeekSlider from '../components/SeekSlider';
import Slider2 from '../components/Slider2';
import NowPlaying from '../components/NowPlaying';
import PlayButton from '../components/PlayButton';
import VolumeSlider from '../components/VolumeSlider';
// import Audio from '../components/Audio';
import '../styles/MusicBar.css';
import albumArt from '../public/AlbumArt.svg';

class MusicBar extends Component {
	constructor(props){
		super(props);
		this.state = {
			isPlaying: false,
			nowPlayingURL: null,
			volume: 0.5,
			muted: false,
			looping: false,
			shuffle: false,
			position: 0,
			timeupdateListening: true,
		}
		this.Audio = new Audio();
		this.audioPlayer
		this.timer = null;
		// this.PlayButtonHandler = this.PlayButtonHandler.bind(this);
		// this.getNowPlayingURL = this.getNowPlayingURL.bind(this);
	}

	componentDidMount(){
		this.Audio.addEventListener("timeupdate", this.handleCurrentTime);
		this.Audio.addEventListener("ended", this.handleSongEnd);
	}

	componentWillUnmount(){
		this.Audio.removeEventListener("timeupdate", this.handleCurrentTime);
		this.Audio.addEventListener("ended", this.handleSongEnd);
	}

	componentDidUpdate(prevProps) {
		if(!this.state.isPlaying){
			clearInterval(this.timer);
		}

		if(prevProps.nowPlaying._id !== this.props.nowPlaying._id){
			this.setState(()=>({
				nowPlayingURL: this.getNowPlayingURL(),
			}));
			this.Audio.volume = this.state.volume;
			this.Audio.muted = this.state.muted;
			this.Audio.load();
			this.Audio.preload = 'auto';
			// document.getElementsByTagName('AUDIO')[0].load();
			// document.getElementsByTagName('AUDIO')[0].preload = 'auto';
			clearInterval(this.timer);
		}
		// console.log("Buffered: ",document.getElementsByTagName('AUDIO')[0].buffered);
		let buff = this.Audio.buffered;
		// console.log(buff);

		// if(buff.length !== 0){
		// 	console.log(buff.start(0));
		// 	console.log(buff.end(0));
		// }
	}

	componentWillReceiveProps(nextProps){
		if(nextProps.nowPlaying._id !== this.props.nowPlaying._id){
			this.setState((prevState) => ({
				isPlaying : !prevState,
			}));
		}
	}

	PlayButtonHandler = () => {
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
				// this.timer = setInterval(() => {
				// 	this.setState((prevState) => ({
				// 		position: this.Audio.currentTime,
				// 	}))
				// },1000);
			}
		}
	}

	handleCurrentTime = () => {
		this.setState((prevState) => ({
			position: this.Audio.currentTime,
		}));
	}

	setCurrentTime = (time) => {
		this.Audio.currentTime = time;
	}

	toggleTimeUpdateListening = () => {
		if(this.state.timeupdateListening){
			this.Audio.removeEventListener("timeupdate", this.handleCurrentTime);
			this.setState(() => ({
				timeupdateListening: false,
			}));
		}
		else{
			this.Audio.addEventListener("timeupdate", this.handleCurrentTime);
			this.setState(() => ({
				timeupdateListening: true,
			}));
		}
	}

	getNowPlayingURL = () => {
		if(Object.keys(this.props.nowPlaying).length === 0 && this.props.nowPlaying.constructor === Object){
			return null;
		}
		else{
			this.Audio.src = `http://localhost:3005/tracks/${this.props.nowPlaying._id}`;
			return `http://localhost:3005/tracks/${this.props.nowPlaying._id}`;
		}
	}

	changeVolume = (value) => {
		console.log("Volume: ",value)
		this.setState({
			volume: value,
		},() => {
			this.Audio.volume = this.state.volume;
		});
	}

	toggleMute = () => {
		this.setState({
			muted: !this.state.muted,
		}, () => {
			this.Audio.muted = this.state.muted;
		});	
	}

	handleSongEnd = () => {
		if(this.state.looping && this.state.shuffle){
			let index = Math.floor(Math.random() * Math.floor(this.props.songs.length + 1));
			let id = this.props.songs[index]._id;
			this.props.playSong(id);
			this.Audio.play();
			return;
		}

		if(!this.state.looping && !this.state.shuffle) {
			this.setState(() => ({
				isPlaying: false,
			}));
			return;
		}

		if(!this.state.looping) {
			this.setState(() => ({
				isPlaying: false,
			}));
		}

		if(this.state.shuffle) {
			let index = Math.floor(Math.random() * Math.floor(this.props.songs.length + 1));
			let id = this.props.songs[index]._id;
			this.props.playSong(id);
		}

		else if(this.state.looping) {
			this.Audio.play();
		}
	}

	toggleLoop = () => {
		this.setState((prevState) => ({
			looping: !prevState.looping,
		}));
	}

	toggleShuffle = () => {
		this.setState((prevState) => ({
			shuffle: !prevState.shuffle,
		}));
	}

	render(){
		const {nowPlaying} = this.props;
		const duration = this.props.nowPlaying.duration || 0;
		const songId = this.props.nowPlaying.id;

		return (
			<div className="musicbar-wrapper">

				<img className="albumart" src={nowPlaying.picture || albumArt} alt="Album art"></img>
				{/*<audio src={this.getNowPlayingURL()} type="audio/mp3" controls />*/}
				<div className="MusicBar">
					{/*<Audio 
						source={this.state.nowPlayingURL}
					/>*/}

					<NowPlaying
						{...nowPlaying}
					/>
					
					<Slider2
						isPlaying = {this.state.isPlaying}
						duration={duration}
						position = {this.state.position}
						playButtonToggle={this.PlayButtonHandler}
						setCurrentTime={this.setCurrentTime}
						toggleListener={this.toggleTimeUpdateListening}
					/>
					{/* <SeekSlider
						song = {songId}
						duration={duration}
						isPlaying = {this.state.isPlaying}
						position = {this.state.position}
						pause={this.PlayButtonHandler}
						setCurrentTime={this.setCurrentTime}
					/> */}
				

					<PlayButton
						song = {songId}
						isPlaying = {this.state.isPlaying}
						onClick = {this.PlayButtonHandler}
					/>

					<VolumeSlider 
						changeVolume={this.changeVolume}
						muted={this.state.muted}
						toggleMute={this.toggleMute}
						toggleLoop={this.toggleLoop}
						looping={this.state.looping}
						shuffle = {this.state.shuffle}
						toggleShuffle = {this.toggleShuffle}
					/>
				</div>

			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		nowPlaying: getNowPlaying(state),
		songs: getSongs(state),
	}
}

MusicBar = connect(mapStateToProps, {playSong,})(MusicBar);

export default MusicBar;