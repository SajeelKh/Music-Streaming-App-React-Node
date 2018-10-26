import React, {Component} from 'react';
import {connect} from 'react-redux';
import {getNowPlaying} from '../reducers';
import SeekSlider from '../components/SeekSlider';
import NowPlaying from '../components/NowPlaying';
import PlayButton from '../components/PlayButton';
import '../styles/MusicBar.css';

class MusicBar extends Component {
	constructor(props){
		super(props);
		this.state = {
			isPlaying: false,
			volume: 50,
			song: '...',
			position: '0:00',
		}
		this.PlayButtonHandler = this.PlayButtonHandler.bind(this);
	}

	componentWillReceiveProps(nextProps){
		if(nextProps.nowPlaying.id !== this.props.nowPlaying.id){
			this.setState((prevState) => ({
				isPlaying : !prevState
			}));
		}
	}

	PlayButtonHandler(){
		this.setState({isPlaying : !this.state.isPlaying});
	}

	render(){
		const {nowPlaying} = this.props;
		const duration = this.props.nowPlaying.duration || 0;
		const songId = this.props.nowPlaying.id;

		return (
			<div className="musicbar-wrapper">
				<div className="MusicBar">
					<SeekSlider
						song = {songId}
						duration={duration} 
						isPlaying = {this.state.isPlaying}
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