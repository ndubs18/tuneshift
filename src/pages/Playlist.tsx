import {useState, useEffect} from 'react';

import {parseAccessToken, getCurrentUsersPlaylits} from '../spotify/spotify';

interface IPlaylists {
    items : IPlaylist[]

}
interface IPlaylist {
    name: string,
    images: object[]
} 

let Playlist = () => {
    let [playlists, setPlaylists] = useState<IPlaylists | null>(null);


    useEffect(() => {
        //let accessToken = parseAccessToken();
        getCurrentUsersPlaylits().then(data=> {
            let playlists = data;
            setPlaylists(playlists);
            
    });
        
    },[])
    
    return (
        <div>
            <h1>Spotify Playlists</h1>
            <ul>
                {playlists?.items.map(playlist => <li>{playlist.name}</li> )}
            </ul>
        </div>
    )
}

export default Playlist