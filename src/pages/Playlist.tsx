import {useState, useEffect} from 'react';

import {parseAccessToken, getCurrentUsersPlaylits} from '../spotify/spotify';


let Playlist = () => {
    let [data, setData] = useState({
        parsedData: [],
        accessToken: '',
        loading: true
    });

    useEffect(() => {
        let accessToken = parseAccessToken();
        let playlists = getCurrentUsersPlaylits();
        console.log(playlists);
    })
    return (
        <div>
            This will be the playlists page
        </div>
    )

}

export default Playlist