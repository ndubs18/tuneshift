import {useState, useEffect} from 'react';

import PlaylistCard from '../components/PlaylistCard/PlaylistCard';
import SpotifyPlaylists from '../components/SpotifyPlaylists/SpotifyPlaylists';
import ApplePlaylists from '../components/ApplePlaylists/ApplePlaylists';
import {parseAccessToken, getCurrentUsersPlaylits} from '../spotify/spotify';

import styles from './Playlists.module.css';
import '../components/PlaylistCard/PlaylistCard.module.css'
 
let Playlists = () => {
 
    return (
        <>
        {window.location.pathname === '/transfer' && window.location.search ==='?state=Spotify' ? <SpotifyPlaylists/> : <ApplePlaylists/>}
        </>
    )
}

export default Playlists