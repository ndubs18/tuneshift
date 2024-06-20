import {useState, useEffect} from 'react';

import PlaylistCard from '../components/PlaylistCard/PlaylistCard';
import {parseAccessToken, getCurrentUsersPlaylits} from '../spotify/spotify';

import styles from './Playlists.module.css';
import '../components/PlaylistCard/PlaylistCard.module.css'

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

let Playlists = () => {
    let [playlists, setPlaylists] = useState<IPlaylists | null>(null);

    useEffect(() => {
        let accessToken = parseAccessToken();
        getCurrentUsersPlaylits().then(data=> {
            let playlists = data;
            //console.log(playlists);
            setPlaylists(playlists);
            
    });
        
    },[])
    
    return (
        <div>
            <h1 style={{marginLeft: '2rem'}}>Spotify Playlists</h1>
            <h2>Choose a playlist to transfer</h2>
            <ul className={styles.playlists}>
                {playlists?.items.map(playlist => <li key={playlist.id}>
                    <PlaylistCard  playlistId={playlist.id}name={playlist.name ? playlist.name : 'null'} owner={playlist.owner.display_name} imgUrl={playlist.images[0].url}/> </li>
                    )
                }
            </ul>
        </div>
    )
}

export default Playlists