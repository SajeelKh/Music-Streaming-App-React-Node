import React, {Component} from 'react';
import Playlist from './Playlist';
import FilterLink from '../containers/FilterLink';
import SongItem from './SongItem';

class ArtistItem extends Component {
    handleClick = () => {
        const {name, songs, onClickSong} = this.props;
        this.render = () => <Playlist songs={songs} onClickSong={onClickSong}/>
        this.forceUpdate();
    }

    // componentDidMount(){
    //     this.addEventListener('click', this.handleClick);
    // }

    // componentWillUnmount(){
    //     this.removeEventListener('click', this.handleClick);
    // }

    render(){
        const {name, songs, onClickSong} = this.props;
        return (
            <div>
                <FilterLink filter={'artist/songs'}>
                    <div className="artistItem" onClick={() => this.handleClick()}>
                        <img className="artistImg"></img>
                        <p>{name}</p>
                    </div>
                </FilterLink>
            </div>
        );
    }
}

export default ArtistItem;