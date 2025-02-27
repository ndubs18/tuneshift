
import { useState, useEffect } from 'react';
import styles from '../../pages/Playlists.module.css';
import { useSource } from '../../pages/Source';
import { ApplePlaylistCard } from '../ApplePlaylistCard/ApplePlaylistCard'
import noArtImg from '../../assets/images/noArtwork.png'
import appleLogo from '../../assets/images/Apple_Music_Icon_wht_lg_072420.svg'
import { getApplePlaylists, handleMusicKitLoaded, formatImgUrl } from '../../apple/apple';

interface IPlaylist {
  name: string,
  id: string;
  attributes: {
    artwork?: { url: string },
    name: string;
    canEdit: boolean;
  }
}
let ApplePlaylists = () => {

  //get the context value

  const { sourcePlatform } = useSource();

  let [playlists, setPlaylists] = useState<IPlaylist[] | null>(null)
  let [loading, setLoading] = useState(false);

  useEffect(() => {
    handleMusicKitLoaded().then(() => {
      setLoading(true);
      // Fetch Apple Music playlist
      getApplePlaylists().then(playlists => {
        setPlaylists(playlists);
        setLoading(false);
      })
    })
  }, [])

  return (
    <div>
      <h1 className={styles.playlistHeading}>Apple Music Playlists</h1>
      {sourcePlatform === "Apple Music" ? <>
        <h2 className={styles.playlistSecondaryHeading}>Choose a playlist to transfer</h2>
        {loading ? <h2 className={styles.loading}>Loading...</h2> : <></>}
        <ul className={styles.playlists}>

          {loading ? <> </> :
            playlists?.map(playlist =>
              <li className={styles.playlistsLi} key={playlist.id}>
                <ApplePlaylistCard
                  playlistId={playlist.id}
                  name={playlist.attributes.name ? playlist.attributes.name : 'null'}
                  sourcePlatform={sourcePlatform}
                  imgUrl={playlist.attributes.artwork?.url ? formatImgUrl(playlist.attributes.artwork?.url) : noArtImg}
                />
              </li>
            )
          }
        </ul>
      </> :
        <>
          <h2 className={styles.playlistSecondaryHeading}>What playlist would you like to transfer to?</h2>
          {loading ? <h2 className={styles.loading}>Loading...</h2> : <></>}
          <ul className={styles.playlists}>
            {loading ? <></> :
              playlists?.map(playlist => {
                if (playlist.attributes.canEdit) {
                  return <li className={styles.playlistsLi} key={playlist.id}>
                    <ApplePlaylistCard playlistId={playlist.id}
                      name={playlist.attributes.name ? playlist.attributes.name : 'null'}
                      sourcePlatform={sourcePlatform}
                      imgUrl={playlist.attributes.artwork?.url ? formatImgUrl(playlist.attributes.artwork?.url) : noArtImg}
                    />
                  </li>
                }
                else return null;
              }
              )
            }
          </ul>
        </>
      }
      <img className={styles.appleLogo} src={appleLogo} />
    </div>
  )
}

export default ApplePlaylists;
