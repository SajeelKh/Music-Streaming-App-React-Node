import React from 'react';
import ArtistItem from './ArtistItem';
import {Switch, Route, withRouter} from 'react-router-dom';
import Playlist from './Playlist';

let ArtistList = ({artistList, songsByArtist, onClickSong, location}) => {
    const keys =  Object.keys(songsByArtist);

    return (
        <React.Fragment>
            <Switch>
                {/* <Route path='/artist/:name' render = {() => 
                    <Playlist
						songs={location.state.songs}
						onClickSong={onClickSong}
					/>}
                /> */}

                <Route path='/artist' render = {() => 
                    keys.map(key => 
                    <ArtistItem
                        key={key}
                        name={key}
                        songs={songsByArtist[key]}
                        onClickSong={onClickSong}
                    />
                )
            } />
            </Switch>
        </React.Fragment>
    );
}

ArtistList = withRouter(ArtistList);

export default ArtistList;