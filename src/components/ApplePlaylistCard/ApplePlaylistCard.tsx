import { useState } from 'react';
import styles from '../PlaylistCard/PlaylistCard.module.css'
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useSource } from '../../App';

export default function ApplePlaylistCard({ playlistId, name, imgUrl, owner }
    : { playlistId: string, name: string, imgUrl?: string, owner?: string, sourcePlatform: string | null }) {

    const navigate = useNavigate();
    let [open, setOpen] = useState<boolean>(false);

    let [playlistItems, setPlaylistItems] = useState([]);

    let { sourcePlatform } = useSource();

    const [searchParams] = useSearchParams();

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
                    {// Selecting the target apple music playlist 
                        //! We're alread logged after the redirect to the current page so we don't need to login again!!!
                        sourcePlatform === 'Spotify' ?
                            <button onClick={async () => {
                                // TODO can we use link for this instead so we don't send another http request?
                                let sourcePlaylistId = searchParams.get('sourcePlaylistId');
                                let sourcePlaylistName = searchParams.get('sourcePlaylistName')

                                navigate(`/transferring?source=${sourcePlatform}&sourcePlaylistId=${sourcePlaylistId}&sourcePlaylistName=${sourcePlaylistName}&target=Apple Music&targetPlaylistId=${playlistId}&targetPlaylistName=${name}`);
                            }
                            }>Transfer</button>
                            :
                            <button onClick={async () => {
                                window.location.replace(`${process.env.AUTH_SERVICE_BASE_URL}/login/spotify?source=${sourcePlatform}&sourcePlaylistId=${playlistId}&sourcePlaylistName=${name}`)
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

export { ApplePlaylistCard }
