import { useState } from 'react';
import styles from '../PlaylistCard/PlaylistCard.module.css'
import { useSearchParams } from 'react-router-dom';
import { useSource } from '../../App';
import { useNavigate } from 'react-router-dom';

export default function SpotifyPlaylistCard({ playlistId, name, imgUrl, owner }
    : {
        playlistId: string
        name: string,
        imgUrl?: string,
        owner?: string,
    }) {
    const navigate = useNavigate();
    let [open, setOpen] = useState<boolean>(false);

    let [playlistItems, setPlaylistItems] = useState([]);

    const [searchParams] = useSearchParams();

    let { sourcePlatform } = useSource();

    if (open) {
        return (
            <>
                <div className={styles.playlistCard} onClick={() => {
                    setOpen(open => !open)
                }}>
                    <img src={imgUrl} alt={name} />
                    <h4>{name}</h4>
                </div>
                <div className={styles.playlistCardDropdown}>
                    <ul className={styles.metaData}>
                        {owner ? <li>owner: {owner}</li> : null}
                        <li>id: {playlistId}</li>
                    </ul>
                    {//select the target spotify playlist
                        sourcePlatform === 'Apple Music' ?
                            <button onClick={async () => {
                                // TODO we need to figure out how to maintain source and target playlists through redirects
                                let sourcePlaylistId = searchParams.get('sourcePlaylistId');
                                let sourcePlaylistName = searchParams.get('sourcePlaylistName');
                                navigate(`/transferring?source=${sourcePlatform}&sourcePlaylistId=${sourcePlaylistId}&sourcePlaylistName=${sourcePlaylistName}&target=Spotify&targetPlaylistId=${playlistId}&targetPlaylistName=${name}`)
                            }
                            }>Transfer</button>
                            :
                            <button onClick={async () => {
                                window.location.replace(`http://localhost:8080/login/Apple?source=${sourcePlatform}&sourcePlaylistId=${playlistId}&sourcePlaylistName=${name}&target=Apple Music`)
                            }}>Transfer</button>
                    }
                </div>
            </>
        )
    } else {
        return (
            <div className={styles.playlistCard} onClick={() => {
                setOpen(open => !open);
            }}>
                <img src={imgUrl} alt={name} />
                <h4>{name}</h4>
            </div>
        )
    }
}

export { SpotifyPlaylistCard }
