import React from 'react';
import ArtistItem from './ArtistItem';

const ArtistList = ({artistList, songsByArtist, onClickSong}) => {
    const keys =  Object.keys(songsByArtist);

    return (
        keys.map(key => 
            <ArtistItem
                key={key}
                name={key}
                songs={songsByArtist[key]}
                onClickSong={onClickSong}
            />
        )
    );
}

export default ArtistList;