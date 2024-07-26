
import {useState, useEffect} from 'react';
import SpotifyPlaylists from '../components/SpotifyPlaylists/SpotifyPlaylists';
import ApplePlaylists from '../components/ApplePlaylists/ApplePlaylists';
import { PlaylistProps } from '../types/types';

import '../components/PlaylistCard/PlaylistCard.module.css'
import userEvent from '@testing-library/user-event';
import { useSource } from '../App';
 
let Playlists = () => {

    let [target, setTarget] = useState<string | null>('');
    //let [sourcePlaylist, setSourcePlaylist] = useState<string[] | void>([]);
    //grab the context value
    //TODO we should set the target and source as a global state variable (pass setState hook from app with useSource)
    const {sourcePlatform, sourcePlaylist, setSourcePlaylist}  = useSource();

    // ! we commented this out because this it originally passed sourcePlaylist setter
    // let setSourcePlaylistWrapper = (songs : string[] | void) => {
    //     setSourcePlaylist(songs);
    // }

    let getSearchParams = () : URLSearchParams => {
        let urlSearch = window.location.search;
        let params = new URLSearchParams(urlSearch);
        return params;

    }

    let renderPlaylist = () => {
        if(!target) {
            return ( 
                <>{sourcePlatform === 'Spotify' ? <SpotifyPlaylists/> : <ApplePlaylists/>}</>
            )
        } else {
            return (
                <>{target === 'Spotify' ? <SpotifyPlaylists/> : <ApplePlaylists />}</>
            )
        }
    }

    useEffect(() => {
        let params = getSearchParams();
        let target : null | string = params.get("target")
        if(target) {
            setTarget(target);
        }
        console.log(sourcePlaylist)
    },[])
 
    return (
       renderPlaylist()
    )
}

export default Playlists