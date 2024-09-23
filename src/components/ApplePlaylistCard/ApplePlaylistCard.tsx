import { useState } from 'react';
import styles from '../PlaylistCard/PlaylistCard.module.css'

import { Song } from '../../types/types';
import { useSearchParams } from 'react-router-dom';
import { getSpotifyPlaylistSongs } from '../../spotify/spotify'
import { getApplePlaylistItems, getApplePlaylistSongIsrcs } from '../../apple/apple'
import { useSource } from '../../App';

export default function ApplePlaylistCard({playlistId, name, imgUrl, owner}
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

    let {sourcePlatform} = useSource();

    const [searchParams] = useSearchParams();

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
                        {// Selecting the target apple music playlist 
                        //! We're alread logged after the redirect to the current page so we don't need to login again!!!
                        sourcePlatform === 'Spotify' ?
                        <button onClick = { async () => {
                                // TODO can we use link for this instead so we don't send another http request?

                                let sourcePlaylistId = searchParams.get('sourcePlaylistId');

                                window.location.replace(`http://localhost:3000/transferring?source=${sourcePlatform}&sourcePlaylistId=${sourcePlaylistId}&target=Apple Music&playlistId=${playlistId}`);
                        }
                        }>Transfer</button> 
                            :
                            <button onClick = { async () => { 
                                // let librarySongs = await getApplePlaylistItems(playlistId);  
                                // let {catalogSongs, songsNotFound} = await getApplePlaylistSongIsrcs(librarySongs);
                                // let stringCatalogSongs = JSON.stringify(catalogSongs);
                            
                                // let stringSongsNotFound = JSON.stringify(songsNotFound);
                                
                                // localStorage.setItem('sourceSongs', stringCatalogSongs);
                                // localStorage.setItem('errorSongs', stringSongsNotFound);
            
                                // window.location.replace(`http://localhost:8080/login/spotify?source=${sourcePlatform}`)
                                window.location.replace(`http://localhost:8080/login/spotify?source=${sourcePlatform}&sourcePlaylistId=${playlistId}`)
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

export {ApplePlaylistCard}