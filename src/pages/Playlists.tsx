
import {useState, useEffect} from 'react';
import SpotifyPlaylists from '../components/SpotifyPlaylists/SpotifyPlaylists';
import ApplePlaylists from '../components/ApplePlaylists/ApplePlaylists';

import '../components/PlaylistCard/PlaylistCard.module.css'
import userEvent from '@testing-library/user-event';
import { useSource } from '../App';
 
let Playlists = () => {

    let [target, setTarget] = useState<null | string>('');
    //grab the context value
    //TODO we should set the target and source as a global state variable (pass setState hook from app with useSource)
    const source = useSource();

    let getSearchParams = () : URLSearchParams => {
        let urlSearch = window.location.search;
        let params = new URLSearchParams(urlSearch);
        return params;

    }

    let renderPlaylist = () => {
        if(!target) {
            return ( 
                <>
                    {window.location.pathname === '/transfer' && window.location.search ==='?source=Spotify' ? <SpotifyPlaylists/> : <ApplePlaylists/>}
                </>
            )
        }
        else {
            return (
                <>
                    {target && source === 'Spotify' ? <ApplePlaylists/> : <SpotifyPlaylists/>}
                </>
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