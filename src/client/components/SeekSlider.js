import React, {Component} from 'react';
import Slider from './Slider';

class SeekSlider extends Component {
	constructor(props){
		super(props);
		this.state = {
			remainingTime: this.props.duration,
		}

		this.getTimeFromMS = this.getTimeFromMS.bind(this);
		this.getTimeFromS = this.getTimeFromS.bind(this);
		this.updateTime = this.updateTime.bind(this);
	}

	componentWillReceiveProps(nextProps){
		this.setState(() => ({
			remainingTime: nextProps.remainingTime,
		}));
	}
	
	getTimeFromMS(ms){
		var minutes = Math.floor(ms / 60000);
		var seconds = ((ms % 60000) / 1000).toFixed(0);
		return (seconds == 60 ? (minutes + 1) + ":00" : minutes + ":" + (seconds < 10 ? "0" : "") + seconds);
	}

	getTimeFromS(s){
		var minutes = Math.floor(s / 60);
		var seconds = (s % 60).toFixed(0);
		return (seconds == 60 ? (minutes + 1) + ":00" : minutes + ":" + (seconds < 10 ? "0" : "") + seconds);
	}

	updateTime(time){
		this.setState((prevState) => ({
			remainingTime: this.props.remainingTime,
		}));
	}

	render(){
		const {song, duration} = this.props;

		return (
			<div className="SeekSlider">
				<Slider
					song={song}
					duration = {duration}
					isPlaying = {this.props.isPlaying}
					updateTime = {this.updateTime}
				/>
				<p className="remainingTimeTag">{this.getTimeFromS(this.state.remainingTime)}</p>
				
				<p className="totalTimeTag">{this.getTimeFromS(duration)}</p>
			</div>
		);
	}
}

export default SeekSlider;