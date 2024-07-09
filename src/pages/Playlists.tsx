
import SpotifyPlaylists from '../components/SpotifyPlaylists/SpotifyPlaylists';
import ApplePlaylists from '../components/ApplePlaylists/ApplePlaylists';

import '../components/PlaylistCard/PlaylistCard.module.css'
 
let Playlists = () => {
 
    return (
        <>
        {window.location.pathname === '/transfer' && window.location.search ==='?source=Spotify' ? <SpotifyPlaylists/> : <ApplePlaylists/>}
        </>
    )
}

export default Playlists