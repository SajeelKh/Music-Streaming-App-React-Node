import React, {Component} from 'react';
import Playlist from './Playlist';

class ArtistItem extends Component {
    handleClick = () => {
        // this.render = () => <Playlist songs={this.props.songs} />
        // this.forceUpdate();
    }

    // componentDidMount(){
    //     this.addEventListener('click', this.handleClick);
    // }

    // componentWillUnmount(){
    //     this.removeEventListener('click', this.handleClick);
    // }

    render(){
        const {name, songs} = this.props;
        return (
            <div className="artistItem" onClick={() => this.handleClick()}>
                <img className="artistImg"></img>
                <p>{name}</p>
            </div>
        );
    }
}

export default ArtistItem;