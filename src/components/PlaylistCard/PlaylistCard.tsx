import { useState } from 'react';
import styles from './PlaylistCard.module.css';

import {getSpotifyPlaylistItems} from '../../spotify/spotify'

export default function PlaylistCard({playlistId, name, imgUrl, owner, sourcePlatform, setSourcePlaylist}
    : {
    playlistId : string
    name : string,
    imgUrl? : string, 
    owner? : string, 
    sourcePlatform: string,
    setSourcePlaylist: (songs : string[]) => void
    }
){
    let [open, setOpen] = useState<boolean>(false);
    let [playlistItems, setPlaylistItems] = useState([]);

    let getPlaylisSongs = async (id : string) => {
        let songs = await getSpotifyPlaylistItems(id);
        return songs;
    }

    if(open) {
        return (
            <> 
                <div className={styles.playlistCard} onClick={() => { 
                    setOpen(open => !open)}}>
                    <img src={imgUrl} alt={name} />
                    <h4>{name}</h4>
                </div>
                    <div className={styles.playlistCardDropdown}>
                        <ul className={styles.metaData}>
                            {owner ? <li>owner: {owner}</li> : null }
                            <li>id: {playlistId}</li> 
                        </ul>
                        {
                        sourcePlatform === 'Spotify' ?
                        <button onClick = {async() => {
                                // TODO we need to figure out how to maintain source and target playlists through redirects
                                // let songs : string[] = await getPlaylisSongs(playlistId);
                                // setSourcePlaylist(songs);
                                window.location.replace(`http://localhost:8080/login/apple?source=${sourcePlatform}&target=Apple Music`)
                        }
                        }>Transfer</button> 
                            :
                            <button onClick = {() => 
                                window.location.replace(`http://localhost:8080/login/spotify?source=${sourcePlatform}&target=Spotify`)}>Transfer</button>  
                        }
                    </div>      
            </>
        )  
    } else {
        return (
                <div className={styles.playlistCard} onClick={() => {
                setOpen(open => !open);
                }}>
                    <img src={imgUrl} alt={name} />
                    <h4>{name}</h4>
                </div>
        )
    }
}