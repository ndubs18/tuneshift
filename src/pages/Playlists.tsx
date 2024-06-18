import {useState, useEffect} from 'react';

import PlaylistCard from '../components/PlaylistCard/PlaylistCard';
import {parseAccessToken, getCurrentUsersPlaylits} from '../spotify/spotify';

import './Playlists.module.css'
import '../components/PlaylistCard/PlaylistCard.module.css'

interface IPlaylists {
    items : IPlaylist[]

}
interface IPlaylist {
    name: string,
    snapshot_id: string,
    images: {url : string}[]
} 

let Playlists = () => {
    let [playlists, setPlaylists] = useState<IPlaylists | null>(null);

    useEffect(() => {
        let accessToken = parseAccessToken();
        getCurrentUsersPlaylits().then(data=> {
            let playlists = data;
            setPlaylists(playlists);
            
    });
        
    },[])
    
    return (
        <div>
            <h1 style={{marginLeft: '2rem'}}>Spotify Playlists</h1>
            <h2>Choose a playlist to transfer</h2>
            <ul className='playlists'>
                {playlists?.items.map(playlist =>
                    <PlaylistCard name={playlist.name ? playlist.name : 'null'} imgUrl={playlist.images[0].url}/> 
                    )
                }
            </ul>
        </div>
    )
}

export default Playlists