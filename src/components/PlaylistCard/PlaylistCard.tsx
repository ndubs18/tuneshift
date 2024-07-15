import { useState } from 'react';
import styles from './PlaylistCard.module.css';

export default function PlaylistCard({playlistId, name, imgUrl, owner, sourcePlatform}
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
                        <button onClick = {() => 
                                window.location.replace(`http://localhost:8080/login/apple?source=${sourcePlatform}&target=Apple Music`)}>Transfer</button> 
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