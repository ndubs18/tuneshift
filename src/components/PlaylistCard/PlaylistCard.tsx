import { useState } from 'react';
import styles from './PlaylistCard.module.css'

export default function PlaylistCard({name, imgUrl}
    : {
    name: string,
    imgUrl: string
    }
){
    let [open, setOpen] = useState(false);

    //!TODO we need to figure out what to display if there is no name 

    if(open) {
        return (   
                <li className={styles.playlistCard} onClick={() => {
                    setOpen(open => !open);
                }}>
                    <img src={imgUrl} alt={name} />
                    <h4>{name}</h4>
                    <button>Transfer</button>
                </li> 
        )  
    } else {
        return (
                <li className={styles.playlistCard} onClick={() => {
                setOpen(open => !open);
                }}>
                    <img src={imgUrl} alt={name} />
                    <h4>{name}</h4>
                </li>
        )
    }
}