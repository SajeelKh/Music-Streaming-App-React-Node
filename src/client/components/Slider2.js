import React, {Component} from 'react';
import dragElement from '../draggable';

class Slider2 extends Component{
	constructor(props){
		super(props);
		this.state = {
			dragging: false,
		}

		this.thumb = null;
		this.track = null;
	}

	componentDidMount(){
		dragElement(document.getElementById("thumb2"), document.getElementById("track2"));
		document.addEventListener('mouseup', this.handleMouseUp);
		// console.log("PageX", this.thumb.pageX);
		// console.log("PageX", this.thumb.offsetLeft);
		// console.log("PageX", this.thumb.offsetWidth);
	}

	componentDidUpdate(){
		this.thumb.style.left = parseInt(((this.props.position / this.props.duration) * 100), 10) + "%";
	}

	handleClick = (event) => {
		event.stopPropagation();
		console.log(event.nativeEvent.offsetX, ' px');
		document.getElementById('thumb2').style.left = event.nativeEvent.offsetX  + 'px';
		var clickPosition = (event.clientX  - this.track.getBoundingClientRect().left) / this.track.offsetWidth;
		var clickTime = clickPosition * this.props.duration;
		console.log("clickTime: ", clickTime);
		this.props.setCurrentTime(clickTime);
		// event.target.style.left = event.nativeEvent.offsetX + 'px';
	}

	handleClick2 = (event) => {
		event.stopPropagation();
		event.preventDefault();
	}

	handleMouseDown = (event) => {
		this.setState(() => ({
			dragging: true,
		}));
		this.props.toggleListener();
	}

	handleMouseUp = (event) => {
		console.log("captured", this.state.dragging);
		if(this.state.dragging === true){
			console.log("capturedinside");
			this.setState(() => ({
				dragging: false,
			}));
			// if(event.nativeEvent){
			// 	this.thumb.style.left = event.nativeEvent.offsetX + 'px';
			// }
			var clickPosition = (event.clientX  - this.track.getBoundingClientRect().left) / this.track.offsetWidth;
			var clickTime = clickPosition * this.props.duration;
			console.log("PageX", event.pageX);
			console.log("offsetLeft", this.track.getBoundingClientRect().left);
			console.log("clickTime: ", clickTime);
			this.props.toggleListener();
			this.props.setCurrentTime(clickTime);
		}
	}

	getTimeFromMS = (ms) => {
		var minutes = Math.floor(ms / 60000);
		var seconds = ((ms % 60000) / 1000).toFixed(0);
		return (seconds == 60 ? (minutes + 1) + ":00" : minutes + ":" + (seconds < 10 ? "0" : "") + seconds);
	}

	getTimeFromS = (s) => {
		var minutes = Math.floor(s / 60);
		var seconds = (s % 60).toFixed(0);
		return (seconds == 60 ? (minutes + 1) + ":00" : minutes + ":" + (seconds < 10 ? "0" : "") + seconds);
	}

	render(){
		let { duration, position } = this.props;
		return (
			<div id="slider2">
				<div id="track2"
					onClick={this.handleClick}
					ref={(node) => {this.track = node}}
				>
					<div id="thumb2"
						onClick={this.handleClick2}
						onMouseUp={this.handleMouseUp}
						onMouseDown={this.handleMouseDown}
						ref={(node) => {this.thumb = node}}
					>
						<div id="trail2" />
					</div>
				</div>
				<p className="remainingTimeTag">{this.getTimeFromS(position)}</p>
				<p className="totalTimeTag">{this.getTimeFromS(duration)}</p>
			</div>
		);
	}
}

export default Slider2;