import { useState, useEffect } from "react";
import { useSource } from "../App"

import styles from './Transferring.module.css'
import { addToSpotifyPlaylist, getSpotifyCatalogSongIds, getSpotifyPlaylist } from '../spotify/spotify'
import { Song } from "../types/types";
import { getApplePlaylistItems, getApplePlaylistSongIsrcs } from "../apple/apple";

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

    let transferSpotifySongs = async (sourcePlatform : string, sourcePlaylistId : string, targetPlaylistId : string, songs : Song[] ) => {
        if(sourcePlatform === "Apple Music") {
            
            let songsWithIds = await getSpotifyCatalogSongIds(songs)
            
            let response = await addToSpotifyPlaylist(songsWithIds, targetPlaylistId);

    
        }
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
      //1. set transferring to true
      //2. initiate transfer
      let searchParams = getSearchParams();
      let sourcePlaylistId = searchParams.get("sourcePlaylistId");
      //TODO Lets change the query param to targetPlaylistId
      let targertPlaylistId = searchParams.get("playlistId");
      
      if(targetPlaylistId) {
        setTargetPlaylistId(targetPlaylistId);
      }

      if(sourcePlaylistId) {
        setSourcePlaylistId(sourcePlaylistId)
      }
      //transferSongs(sourcePlatform!,targetPlaylistId,sourcePlaylist!);
      //3. update error songs
      //4. display songs that could be transferred

    

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
            //if source playlist is apple music -> transfer apple songs

            if(sourcePlatform === "Apple Music") {
                TransferAppleSongs(sourcePlatform,sourcePlaylistId,targetPlaylistId)
            }
            else if(sourcePlatform === "Spotify") {

            }
            //else if source playlist is spotify -> transfer spotify songs
        }}></button>
    </div>
    )
}

export default Transferring;