import { useState } from 'react';
import styles from '../PlaylistCard/PlaylistCard.module.css'

import { Song } from '../../types/types';

import { useSearchParams } from 'react-router-dom';

import { getSpotifyPlaylistSongs } from '../../spotify/spotify'
import { getApplePlaylistItems, getApplePlaylistSongIsrcs } from '../../apple/apple'
import { useSource } from '../../App';

export default function SpotifyPlaylistCard({playlistId, name, imgUrl, owner}
: {
playlistId : string
name : string,
imgUrl? : string, 
owner? : string, 
sourcePlatform: string | null,
}) 
    {
    let [open, setOpen] = useState<boolean>(false);
    
    let [playlistItems, setPlaylistItems] = useState([]);

    const [searchParams] = useSearchParams();

    let {sourcePlatform} = useSource();

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
                        {//select the target spotify playlist
                        sourcePlatform === 'Apple Music' ?
                        <button onClick = { async () => {
                                // TODO we need to figure out how to maintain source and target playlists through redirects
                                // window.location.replace(`http://localhost:8080/login/Spotify?source=${sourcePlatform}&playlistId=${playlistId}`)

                                let sourcePlaylistId = searchParams.get('sourcePlaylistId');
                                window.location.replace(`http://localhost:3000/transferring?source=${sourcePlatform}&sourcePlaylistId=${sourcePlaylistId}&target=Spotify&playlistId=${playlistId}`)
                         }
                        }>Transfer</button> 
                            :
                            <button onClick = { async () => {  
                                // let songs : Song[] = await getSpotifyPlaylistSongs(playlistId);
                                // let stringSongs = JSON.stringify(songs);
                                // localStorage.setItem('sourceSongs', stringSongs)

                                window.location.replace(`http://localhost:8080/login/Apple?source=${sourcePlatform}&sourcePlaylistId=${playlistId}&target=Apple Music`)
                            }}>Transfer</button>  
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

export {SpotifyPlaylistCard}