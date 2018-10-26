import React, {Component} from 'react';
import {Link, Redirect, withRouter, Switch} from 'react-router-dom';
import Playlist from './Playlist';
import FilterLink from '../containers/FilterLink';
import SongItem from './SongItem';

class ArtistItem extends Component {
    handleClick = () => {
        const {songs, onClickSong} = this.props;
        <Redirect from='/artist' to='/artist/:name' />
    }

    // componentDidMount(){
    //     this.addEventListener('click', this.handleClick);
    // }

    // componentWillUnmount(){
    //     this.removeEventListener('click', this.handleClick);
    // }

    render(){
        const {name, songs, onClickSong, match} = this.props;
        return (
        <React.Fragment>
            <Link 
                to={{
                        pathname:`${match.path}/${name}`,
                        state: {
                            songs
                        }
                    }
                } onClick={this.handleClick}>
                
                <div className="artistItem">
                    <img className="artistImg"></img>
                    <p>{name}</p>
                </div>

            </Link>
        </React.Fragment>
        );
    }
}

ArtistItem = withRouter(ArtistItem);

export default ArtistItem;