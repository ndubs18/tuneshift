import { useState } from 'react';
import styles from '../PlaylistCard/PlaylistCard.module.css'
import { useSearchParams } from 'react-router-dom';
import { useSource } from '../../pages/Source'
import { useNavigate } from 'react-router-dom';

export default function SpotifyPlaylistCard({ playlistId, name, imgUrl, owner }
    : {
        playlistId: string
        name: string,
        imgUrl?: string,
        owner?: string,
    }) {
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();

    let { sourcePlatform } = useSource();

    return (
        <>
            <div className={styles.playlistCard} onClick={() => {
                if (sourcePlatform === 'Apple Music') {
                    let sourcePlaylistId = searchParams.get('sourcePlaylistId');
                    let sourcePlaylistName = searchParams.get('sourcePlaylistName');
                    navigate(`/transferring?source=${sourcePlatform}&sourcePlaylistId=${sourcePlaylistId}&sourcePlaylistName=${sourcePlaylistName}&target=Spotify&targetPlaylistId=${playlistId}&targetPlaylistName=${name}`)
                } else {
                    window.location.replace(`${process.env.REACT_APP_AUTH_SERVER_URI}/login/Apple?source=${sourcePlatform}&sourcePlaylistId=${playlistId}&sourcePlaylistName=${name}&target=Apple Music`)
                }
            }}>
                <img src={imgUrl} alt={name} />
                <h5 className={styles.cardHeader}>{name}</h5>
            </div>
        </>
    )
}

export { SpotifyPlaylistCard }
