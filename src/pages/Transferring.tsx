import { useState, useEffect } from "react";
import { useSource } from "../App";
import { useNavigate } from "react-router-dom";
import styles from './Transferring.module.css';
import { addToSpotifyPlaylist, getSpotifyCatalogSongIds, getSpotifyPlaylist, getSpotifyPlaylistInfo, getSpotifyPlaylistSongs } from '../spotify/spotify';
import { Song } from "../types/types";
import { addToApplePlaylist, getApplePlaylistInfo, getApplePlaylistItems, getApplePlaylistSongIsrcs, handleMusicKitLoaded } from "../apple/apple";

let Transferring = () => {
    let [loading, setLoading] = useState(true);
    let [transferData, setTransferData] = useState<{ numSongs: number, songsToTransfer: Song[] } | null | undefined>();
    let [transferredSongs, setTransferredSongs] = useState("")

    let [sourcePlaylistName, setSourcePlaylistName] = useState("");
    let [targetPlaylistName, setTargetPlaylistName] = useState("");
    let [sourcePlaylistId, setSourcePlaylistId] = useState("");
    let [targetPlaylistId, setTargetPlaylistId] = useState("");

    //transferring in progress
    let [transferring, setTransferring] = useState(false);

    // let {sourcePlatform, errorSongs} = useSource();
    let [sourcePlatform, setSourcePlatform] = useState<string>('');

    const navigate = useNavigate();

    let getSearchParams = (): URLSearchParams => {
        let urlSearch = window.location.search;
        let params = new URLSearchParams(urlSearch);
        return params;

    }

    let transferSpotifySongs = async (sourcePlatform: string, sourcePlaylistId: string, targetPlaylistId: string) => {

        let spotifySongs = await getSpotifyPlaylistSongs(sourcePlaylistId);
        handleMusicKitLoaded().then(async () => {
            let added = await addToApplePlaylist(targetPlaylistId, spotifySongs);
        })
    }

    let TransferAppleSongs = async (sourcePlatform: string, sourcePlaylistId: string, targetPlaylistId: string) => {
        //get apple library songs
        let librarySongs = await getApplePlaylistItems(sourcePlaylistId);
        let applePlaylistSongIsrcs = await getApplePlaylistSongIsrcs(librarySongs)
        let spotifyCatalogSongIds = await getSpotifyCatalogSongIds(applePlaylistSongIsrcs);
        let transferred = await addToSpotifyPlaylist(spotifyCatalogSongIds, targetPlaylistId);
    }

    let getPreTransferData = async (sourcePlaylistId: string, sourcePlatform: string) => {
        if (sourcePlatform == "Apple Music") {

            handleMusicKitLoaded().then(async () => {
                let librarySongs = await getApplePlaylistItems(sourcePlaylistId);
                let preTransferData = getApplePlaylistInfo(librarySongs);
                setTransferData(preTransferData);
                setLoading(false)
            })
        }
        else {
            let spotifySongs = await getSpotifyPlaylistSongs(sourcePlaylistId);
            let preTransferData = getSpotifyPlaylistInfo(spotifySongs);
            setTransferData(preTransferData);
            setLoading(false)
        }
    }

    useEffect(() => {

        let searchParams = getSearchParams();
        let sourcePlatform = searchParams.get("source");
        let sourcePlaylistId = searchParams.get("sourcePlaylistId");
        let targetPlaylistId = searchParams.get("targetPlaylistId");
        let sourcePlaylistName = searchParams.get("sourcePlaylistName");
        let targetPlaylistName = searchParams.get("targetPlaylistName");

        if (targetPlaylistId) {
            setTargetPlaylistId(targetPlaylistId);
        }

        if (sourcePlaylistName) {
            setSourcePlaylistName(sourcePlaylistName)
        }
        if (targetPlaylistName) {
            setTargetPlaylistName(targetPlaylistName)
        }

        if (sourcePlatform) {
            setSourcePlatform(sourcePlatform);
        }

        if (sourcePlatform && sourcePlaylistId) {
            setSourcePlaylistId(sourcePlaylistId);
            getPreTransferData(sourcePlaylistId, sourcePlatform);
        }


    }, [])

    return (
        <div className={styles.status}>
            <h2 className={styles.center}>Songs to be Transferred</h2>
            {!loading ?
                <div className={styles.transferContainer}>
                    <ul className={`${styles.p0} ${styles.textAlignStart} ${styles.mb}`}>
                        <li className={`${styles.metaLi}`}>Source playlist: <span className={styles.bold}>{sourcePlaylistName}</span></li>
                        <li className={`${styles.metaLi}`}>Target playlist: <span className={styles.bold}>{targetPlaylistName}</span></li>
                        <li className={`${styles.metaLi}`}>Number of songs: <span className={styles.bold}>{transferData?.numSongs}</span></li>
                    </ul>
                    <ul className={styles.p0 + ' ' + styles.songList + ' ' + styles.mt}>
                        {transferData?.songsToTransfer?.map((song, i) => {
                            return (<li key={i + 1}><p className={`${styles.m0} ${styles.fs1rem} ${styles.song}`}><b>{song.name}</b> by {song.artists}</p></li>)
                        })}
                    </ul>
                    <button className={styles.transferButton} onClick={() => {
                        if (sourcePlatform === "Apple Music") {
                            handleMusicKitLoaded().then(() => {
                                if (sourcePlatform && sourcePlaylistId && targetPlaylistId)
                                    TransferAppleSongs(sourcePlatform, sourcePlaylistId, targetPlaylistId).then(() => {
                                        navigate('/results')
                                    })
                            })
                        }
                        else if (sourcePlatform === "Spotify") {
                            if (sourcePlatform && sourcePlaylistId && targetPlaylistId) {
                                transferSpotifySongs(sourcePlatform, sourcePlaylistId, targetPlaylistId).then(() => {
                                    navigate('/results');
                                })
                            }
                        }
                    }}>Transfer</button>
                </div> : <h2> Loading... </h2>
            }
        </div>
    )
}

export default Transferring;
