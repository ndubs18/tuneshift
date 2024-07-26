import {Profile} from '../../types/types';
import { useState, useEffect } from 'react';
import PlaylistCard from "../PlaylistCard/PlaylistCard";
import { useSource } from "../../App";


import { PlaylistProps } from '../../types/types';

import styles from '../../pages/Playlists.module.css';
import '../PlaylistCard/PlaylistCard.module.css'
import { getCurrentUserProfile, getCurrentUsersPlaylits, parseAccessToken } from '../../spotify/spotify';

interface IPlaylists {
    items : IPlaylist[]

}
interface IPlaylist {
    name : string,
    snapshot_id : string,
    images : {url : string}[],
    id : string
    owner: {
        display_name : string,
        id: string
    }
}

let SpotifyPlaylists =  ({setSourcePlaylist} : PlaylistProps) => {

    //grab the context value
    const source = useSource();

    let [profile, setProfile] = useState<Profile>();
    let [playlists, setPlaylists] = useState<IPlaylists | null>(null);
    let [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        getCurrentUserProfile().then(profile => setProfile(profile))
        getCurrentUsersPlaylits().then(data => {
            let playlists = data;
            setPlaylists(playlists)
            setLoading(false);
        });
    }, [])

    return (
        <div>
            <h1 style={{marginLeft: '2rem'}}>Spotify Playlists</h1>
            {source === 'Spotify' ? 
            <>
                <h2>Choose a playlist to transfer</h2>
                <ul className={styles.playlists}>
                    {loading ? <h3>Loading...</h3> :
                    playlists?.items.map(playlist => <li key={playlist.id}>
                        <PlaylistCard playlistId={playlist.id}
                         name={playlist.name ? playlist.name : 'null'} 
                         owner={playlist.owner.display_name} 
                         imgUrl={playlist.images[0].url} 
                         sourcePlatform={source}
                         setSourcePlaylist={setSourcePlaylist}/> 
                        </li>
                        )
                    }
                </ul> 
            </> :
           <>
           <h2>Where would you like to transfer this playlist?</h2>
           <ul className={styles.playlists}>
               {loading ? <h3>Loading...</h3> :
                    playlists?.items.map(playlist => {
                        if(playlist.owner.id === profile?.id) { 
                        return <li key={playlist.id}>
                        <PlaylistCard playlistId={playlist.id} 
                        name={playlist.name ? playlist.name : 'null'} 
                        owner={playlist.owner.display_name} 
                        imgUrl={playlist.images[0].url} 
                        sourcePlatform = {source}
                        setSourcePlaylist={setSourcePlaylist}/> 
                        </li>
                        }
                        else return null;
                    })
                }
           </ul> 
           </> 
            }   
        </div>
    )
}

export default SpotifyPlaylists;