import { useState } from 'react';
import styles from '../PlaylistCard/PlaylistCard.module.css'
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useSource } from '../../App';

export default function ApplePlaylistCard({ playlistId, name, imgUrl, owner }
    : { playlistId: string, name: string, imgUrl?: string, owner?: string, sourcePlatform: string | null }) {

    const navigate = useNavigate();

    let { sourcePlatform } = useSource();

    const [searchParams] = useSearchParams();

    return (
        <>
            <div className={styles.playlistCard} onClick={() => {
                if (sourcePlatform === 'Spotify') {
                    let sourcePlaylistId = searchParams.get('sourcePlaylistId');
                    let sourcePlaylistName = searchParams.get('sourcePlaylistName')

                    navigate(`/transferring?source=${sourcePlatform}&sourcePlaylistId=${sourcePlaylistId}&sourcePlaylistName=${sourcePlaylistName}&target=Apple Music&targetPlaylistId=${playlistId}&targetPlaylistName=${name}`);
                } else {

                    window.location.replace(`${process.env.REACT_APP_AUTH_SERVER_URI}/login/spotify?source=${sourcePlatform}&sourcePlaylistId=${playlistId}&sourcePlaylistName=${name}`)
                }
            }}>
                <img src={imgUrl} alt={name} />
                <h5 className={styles.cardHeader}>{name}</h5>
            </div>
        </>
    )
}

export { ApplePlaylistCard }
