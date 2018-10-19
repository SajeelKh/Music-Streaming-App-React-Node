import React, {Component} from 'react';

class Slider extends Component{
	constructor(props){
		super(props);
		this.funct = null;
		this.state = {
			finished: false,
		}
		this.count = 0;
		this.duration = 0;
		this.now = 0;
		this.bound = 0;
		this.left = 0;
	}
	componentDidMount(){
		// this.bound = document.getElementsByClassName("SeekSlider")[0].getBoundingClientRect().width;
		this.duration = Math.round(this.props.duration/1000);
		console.log(this.props.duration/1000);
		this.bound = document.getElementById("ball").parentNode.offsetWidth;

		window.addEventListener('resize', this.handleResize);
	}

	componentDidUpdate(){
		this.duration = Math.round(this.props.duration/1000);
	}

	componentWillUnmount(){
		window.removeEventListener('resize', this.handleResize);
	}

	handleResize = () => {
		// this.bound = document.getElementsByClassName("SeekSlider")[0].getBoundingClientRect().width;
		this.bound = document.getElementById("ball").parentNode.offsetWidth;
		if(this.state.finished){
			const ele = document.getElementById("ball");
			ele.style.left = this.bound + "px";
		}
	}

	componentWillReceiveProps(nextProps){
		const ele = document.getElementById("ball");

		if(nextProps.song !== this.props.song){
			clearInterval(this.funct);
			document.getElementById("ball").style.left = 0 + 'px';
			this.left = 0;
			this.count = 0;
		}

		if(nextProps.isPlaying !== this.props.isPlaying){
			if(nextProps.isPlaying === true){
				this.funct = setInterval(()=>
				{
					const ele = document.getElementById("ball");
					var pos = ele.offsetLeft;
					
					const bound = document.getElementById("ball").parentNode.offsetWidth;

					const incVal = ele.parentNode.offsetWidth / this.duration;
					console.log("duration: ",this.duration);
					console.log("TIME INC: ",ele.parentNode.offsetWidth / this.duration);
					console.log("Inc Value: ",incVal);
					console.log('Ball Position: ',pos);
					console.log('Bound: ', this.bound);
					console.log('Bound2: ', ele.parentNode.offsetWidth);
					console.log(bound);
					console.log("-->", this.left)
					console.log("-->", (this.left + incVal));
					
					if(pos === 0)
						pos=0;

					pos = parseInt(pos, 10);
					console.log("Approved To Pass?:", (this.left + incVal) <= (ele.parentNode.offsetWidth));
					if((this.left + incVal) <= (ele.parentNode.offsetWidth)){
						this.left += incVal;
						ele.style.left = (pos + incVal) + "px";
						this.count += 1;
						this.now = parseInt(this.duration - this.count);
						console.log("remainingTime: ", (this.duration - this.count));
						this.props.updateTime(this.now);
					}
					else{
						//ele.style.left = 0 + "px";
						clearInterval(this.funct);
						this.setState((prevState) => ({
							finished:true
						}));
						console.log("TOTAL COUNT: ", this.count);
					}
				} 
				, 1000);
			}
			else{
				clearInterval(this.funct);
			}
		}
	}

	render(){
		const value = this.left;
		const max = this.bound;
		const min = 0;
		const step = this.bound / this.duration;

		return (
			<div 
				id="ball"
				style = {{fontSize:'50%'}}
			>
				{this.now}
			</div>
		)
	}
}
export default Slider;