import { useState, useEffect } from "react";
import { useSource } from "../App"

import styles from './Transferring.module.css'
import { title } from "process";

let Transferring = () => {

    let {sourcePlatform, sourcePlaylist, setSourcePlaylist } = useSource();
    // let [sourcePlatform, setSourcePlatform] = useState<string|null>('');

    let getSearchParams = () : URLSearchParams => {
        let urlSearch = window.location.search;
        let params = new URLSearchParams(urlSearch);
        return params;

    }
    
    useEffect(() => {
        let searchParams = getSearchParams();
        let source = searchParams.get('source');
        console.log(sourcePlatform); 

    })

    
    return (
      <div className={styles.status}>
        <h1 className={styles.center}>Songs to be Transferred</h1>
        <ul className={styles.p0 + ' ' + styles.songList }>
            {sourcePlaylist?.map((song, i) => {
                return (<li key={i+1}><p className={`${styles.m0} ${styles.fs1rem}`}>{song.name}</p></li>)
            })}
        </ul>
      </div> 
       
    )
}

export default Transferring;