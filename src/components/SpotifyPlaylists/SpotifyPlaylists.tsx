import { Profile } from '../../types/types';
import { useState, useEffect } from 'react';
import { useSource } from "../../App";
import { SpotifyPlaylistCard } from '../SpotifyPlaylistCard/SpotifyPlaylistCard'
import styles from '../../pages/Playlists.module.css';
import '../PlaylistCard/PlaylistCard.module.css';
import noArtImg from '../../assets/images/noArtwork.png'
import { getCurrentUserProfile, getCurrentUsersPlaylits, parseAccessToken } from '../../spotify/spotify';

interface IPlaylists {
    items: IPlaylist[]

}
interface IPlaylist {
    name: string,
    snapshot_id: string,
    images: { url: string }[],
    id: string,
    owner: {
        display_name: string,
        id: string
    }
}

let SpotifyPlaylists = () => {

    //grab the context value
    const { sourcePlatform, setSourcePlaylist } = useSource();

    let [profile, setProfile] = useState<Profile>();
    let [playlists, setPlaylists] = useState<IPlaylists | null>(null);
    let [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        getCurrentUserProfile().then(profile => setProfile(profile))
        getCurrentUsersPlaylits().then(data => {
            let playlists = data;
            console.log(playlists);
            setPlaylists(playlists)
            setLoading(false);
        });
    }, [])

    return (
        <div>
            <h1>Spotify Playlists</h1>
            {sourcePlatform === 'Spotify' ?
                <>
                    <h2>Choose a playlist to transfer</h2>
                    <ul className={styles.playlists}>
                        {loading ? <h3>Loading...</h3> :
                            playlists?.items.map(playlist => {
                                if (playlist !== null) {
                                    return <li className={styles.playlistsLi} key={playlist.id}>
                                        <SpotifyPlaylistCard playlistId={playlist.id}
                                            name={playlist.name ? playlist.name : 'null'}
                                            owner={playlist.owner.display_name}
                                            imgUrl={playlist.images ? playlist.images[0].url : noArtImg} /></li>
                                }
                            })
                        }
                    </ul>
                </> :
                <>
                    <h2>Where would you like to transfer this playlist?</h2>
                    <ul className={styles.playlists}>
                        {loading ? <h3>Loading...</h3> :
                            playlists?.items.map(playlist => {
                                if (playlist !== null && playlist.owner.id === profile?.id) {
                                    return <li className={styles.playlistsLi} key={playlist.id}>
                                        <SpotifyPlaylistCard playlistId={playlist.id}
                                            name={playlist.name ? playlist.name : 'null'}
                                            owner={playlist.owner.display_name}
                                            imgUrl={playlist.images ? playlist.images[0].url : noArtImg}
                                        />
                                    </li>
                                }

                                else return null;
                            })
                        }
                    </ul>
                </>
            }
        </div>
    )
}

export default SpotifyPlaylists;
