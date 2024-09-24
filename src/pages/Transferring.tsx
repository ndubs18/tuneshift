import { useState, useEffect } from "react";
import { useSource } from "../App"

import styles from './Transferring.module.css'
import { addToSpotifyPlaylist, getSpotifyCatalogSongIds, getSpotifyPlaylist, getSpotifyPlaylistSongs } from '../spotify/spotify'
import { Song } from "../types/types";
import { addToApplePlaylist, getApplePlaylistItems, getApplePlaylistSongIsrcs, handleMusicKitLoaded } from "../apple/apple";

let Transferring = () => {

    let [transferredSongs, setTransferredSongs] = useState("")
    
    let [sourcePlaylistId, setSourcePlaylistId] = useState("")
    let [targetPlaylistId, setTargetPlaylistId] = useState("");
    
    //transferring in progress
    let [transferring, setTransferring] = useState(false);

    let {sourcePlatform, errorSongs} = useSource();
    // let [sourcePlatform, setSourcePlatform] = useState<string|null>('');

    let getSearchParams = () : URLSearchParams => {
        let urlSearch = window.location.search;
        let params = new URLSearchParams(urlSearch);
        return params;

    }

    let transferSpotifySongs = async (sourcePlatform : string, sourcePlaylistId : string, targetPlaylistId : string ) => {
            
        let spotifySongs = await getSpotifyPlaylistSongs(sourcePlaylistId)
        console.log(spotifySongs);
            handleMusicKitLoaded().then(()=> {    
            let added = addToApplePlaylist(targetPlaylistId,spotifySongs);
            })
    }

    let TransferAppleSongs = async (sourcePlatform : string, sourcePlaylistId : string, targetPlaylistId : string ) => {
        //get apple library songs
        let librarySongs = await getApplePlaylistItems(sourcePlaylistId); 
        //get apple catalog songs 
        let {appleCatalogSongs, songsNotFound} = await getApplePlaylistSongIsrcs(librarySongs);
         
        let spotifyCatalogSongIds = await getSpotifyCatalogSongIds(appleCatalogSongs)
        
        let transferred = await addToSpotifyPlaylist(spotifyCatalogSongIds,targetPlaylistId);
        console.log(transferred);
    }
    
    useEffect(() => {
      let searchParams = getSearchParams();
      let sourcePlaylistId = searchParams.get("sourcePlaylistId");
      //TODO Lets change the query param to targetPlaylistId
      let targetPlaylistId = searchParams.get("playlistId");
      
      if(targetPlaylistId) {
        setTargetPlaylistId(targetPlaylistId);
      }

      if(sourcePlaylistId) {
        setSourcePlaylistId(sourcePlaylistId)
      }
    }, [])

    return (
      <div className={styles.status}>
        <h1 className={styles.center}>Songs to be Transferred</h1>
        {/* <ul className={styles.p0 + ' ' + styles.songList }>
            {sourcePlaylist?.map((song, i) => {
                return (<li key={i+1}><p className={`${styles.m0} ${styles.fs1rem}`}>{song.name}</p></li>)
            })}
        </ul> */}
        <button onClick={() => {
            if(sourcePlatform === "Apple Music") {
                handleMusicKitLoaded().then(()=>{
                    if(sourcePlatform && sourcePlaylistId && targetPlaylistId)
                    TransferAppleSongs(sourcePlatform,sourcePlaylistId,targetPlaylistId)
                })
            }
            else if(sourcePlatform === "Spotify") {
                if(sourcePlatform && sourcePlaylistId && targetPlaylistId) {
                    transferSpotifySongs(sourcePlatform, sourcePlaylistId, targetPlaylistId)
                }
            }
        }}></button>
    </div>
    )
}

export default Transferring;