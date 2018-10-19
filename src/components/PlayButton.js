import React, {Component} from 'react';

class PlayButton extends Component {
	constructor(props){
		super(props);

	}

	render(){
		return (
			<button 
				className="PlayButton"
				onClick={this.props.onClick}
			>
					{this.props.isPlaying?<i className="fas fa-pause"></i>:<i className="fas fa-play"></i>}
			</button>
		);
	}
}

export default PlayButton;