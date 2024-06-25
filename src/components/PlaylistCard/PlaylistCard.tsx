import { useState } from 'react';
import styles from './PlaylistCard.module.css';

export default function PlaylistCard({playlistId, name, imgUrl, owner}
    : {
    playlistId : string
    name: string,
    imgUrl?: string, 
    owner?: string, 
    }
){
    let [open, setOpen] = useState<boolean>(false);

    if(open) {
        return (
            <> 
                <div className={styles.playlistCard} onClick={() => {
                    setOpen(open => !open);
                }}>
                    <img src={imgUrl} alt={name} />
                    <h4>{name}</h4>
                </div>
                    <div className={styles.playlistCardDropdown}>
                        <ul className={styles.metaData}>
                            <li>owner: {owner}</li>
                            <li>id: {playlistId}</li> 
                        </ul>
                        <button onClick = {() => window.location.replace(`http://localhost:8080/login/apple`)}>Transfer</button>
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