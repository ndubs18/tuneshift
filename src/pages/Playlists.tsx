
import {useState, useEffect} from 'react';
import SpotifyPlaylists from '../components/SpotifyPlaylists/SpotifyPlaylists';
import ApplePlaylists from '../components/ApplePlaylists/ApplePlaylists';

import '../components/PlaylistCard/PlaylistCard.module.css'
import userEvent from '@testing-library/user-event';
import { useSource } from '../App';
 
let Playlists = () => {

    let [target, setTarget] = useState<null | string>('');
    let [sourcePlaylist, setSourcePlaylist] = useState<string[] | void>([]);
    //grab the context value
    //TODO we should set the target and source as a global state variable (pass setState hook from app with useSource)
    const source = useSource();

    let setSourcePlaylistWrapper = (songs : string[] | void) => {
        setSourcePlaylist(songs);
    }

    let getSearchParams = () : URLSearchParams => {
        let urlSearch = window.location.search;
        let params = new URLSearchParams(urlSearch);
        return params;

    }

    let renderPlaylist = () => {
        if(!target) {
            return ( 
                <>{source === 'Spotify' ? <SpotifyPlaylists setSourcePlaylist={setSourcePlaylistWrapper}/> : <ApplePlaylists setSourcePlaylist={setSourcePlaylistWrapper}/>}</>
            )
        } else {
            return (
                <>{target === 'Spotify' ? <SpotifyPlaylists setSourcePlaylist={setSourcePlaylistWrapper}/> : <ApplePlaylists setSourcePlaylist={setSourcePlaylistWrapper}/>}</>
            )
        }
    }

    useEffect(() => {
        let params = getSearchParams();
        let target : null | string = params.get("target")
        if(target) {
            setTarget(target);
        }
    },[])
 
    return (
       renderPlaylist()
    )
}

export default Playlists