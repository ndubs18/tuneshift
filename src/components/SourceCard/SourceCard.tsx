import styles from './SourceCard.module.css'
import appleLogo from '../../assets/images/apple_music_icon.svg'
import spotifyLogo from '../../assets/images/spotify_icon.svg'

export let SourceCard = ({ platform, setSourcePlatform }: { platform: string, setSourcePlatform: (platform: string) => void }) => {

  return <div className={styles.sourceCard} onClick={() => {
    setSourcePlatform(platform);
    window.location.assign(`${process.env.REACT_APP_AUTH_SERVER_URI}/login/${platform === 'Spotify' ? 'spotify' : 'apple'}?source=${platform}`);
  }}>
    {platform == 'Spotify' ?
      <>
        <img className={styles.spotifyLogo} src={spotifyLogo} />
        <p>{platform}</p>
      </>
      :
      <>
        <img className={styles.appleLogo} src={appleLogo} />
        <p>{platform}</p>
      </>
    }

  </div>

}
