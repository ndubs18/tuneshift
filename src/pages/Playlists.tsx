import {useState, useEffect} from 'react';

import PlaylistCard from '../components/PlaylistCard/PlaylistCard';
import {parseAccessToken, getCurrentUsersPlaylits} from '../spotify/spotify';

import './Playlists.module.css'
//import '../components/PlaylistCard/PlaylistCard.module.css'

interface IPlaylists {
    items : IPlaylist[]

}
interface IPlaylist {
    name: string,
    images: {url : string}[]
} 

let Playlists = () => {
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
            <ul className='playlists'>
                {playlists?.items.map(playlist => <li key={playlist.name}>
                    <PlaylistCard name={playlist.name} imgUrl={playlist.images[0].url}/> 
                    </li>)
                }
            </ul>
        </div>
    )
}

export default Playlists