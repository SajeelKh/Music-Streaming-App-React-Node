import React from 'react';
import ArtistItem from './ArtistItem';

const ArtistList = ({artistList, songsByArtist}) => {
    const keys =  Object.keys(songsByArtist);

    return (
        keys.map(key => 
            <ArtistItem
                name={key}
                songs={songsByArtist[key]}
            />
        )
    );
}

export default ArtistList;