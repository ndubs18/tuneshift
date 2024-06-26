import { useState, useEffect } from 'react';
import PlaylistCard from "../PlaylistCard/PlaylistCard"

import styles from '../../pages/Playlists.module.css';
import '../PlaylistCard/PlaylistCard.module.css'
import { getCurrentUsersPlaylits, parseAccessToken } from '../../spotify/spotify';

interface IPlaylists {
    items : IPlaylist[]

}
interface IPlaylist {
    name : string,
    snapshot_id : string,
    images : {url : string}[],
    id : string
    owner: {display_name : string}
} 
let SpotifyPlaylists =  () => {

    let [playlists, setPlaylists] = useState<IPlaylists | null>(null);

    useEffect(() => {
        //let accessToken = parseAccessToken();
        getCurrentUsersPlaylits().then(data=> {
            let playlists = data;
            //console.log(playlists);
            setPlaylists(playlists)
        });
    }, [])

    return (
        <div>
            <h1 style={{marginLeft: '2rem'}}>Spotify Playlists</h1>
            <h2>Choose a playlist to transfer</h2>
            <ul className={styles.playlists}>
                {playlists?.items.map(playlist => <li key={playlist.id}>
                    <PlaylistCard  playlistId={playlist.id} name={playlist.name ? playlist.name : 'null'} owner={playlist.owner.display_name} imgUrl={playlist.images[0].url}/> </li>
                    )
                }
            </ul>
        </div>
    )
}

export default SpotifyPlaylists;