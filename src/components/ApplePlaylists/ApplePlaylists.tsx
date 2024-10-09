
import {useState, useEffect} from 'react';
import styles from '../../pages/Playlists.module.css';
import {useSource} from '../../App';
import {ApplePlaylistCard} from '../ApplePlaylistCard/ApplePlaylistCard'
import noArtImg from '../../assets/images/noArtwork.png'
import {getApplePlaylists, handleMusicKitLoaded, formatImgUrl} from '../../apple/apple';

interface IPlaylist {
    name : string,
    id : string;
    attributes : { 
        artwork? : {url : string},
        name : string;
        canEdit : boolean;
    }
} 
let ApplePlaylists = () => {

    //get the context value

    const {sourcePlatform} = useSource();

    let [playlists, setPlaylists] = useState<IPlaylist[] | null>(null)
    let [loading, setLoading] = useState(false);

    useEffect(() => {
      handleMusicKitLoaded().then(() => {
      setLoading(true);
      // TODO: let's clean this up by either defining function elsewhere or promise chaining
      // Fetch Apple Music playlist
      let getPlaylists = async () => {
        let playlists = await getApplePlaylists();
        console.log(playlists)
        setPlaylists(playlists)
        setLoading(false);   
      }

      getPlaylists();
      })
    }, [])
    
    return (
      <div>
       <h1>Apple Music Playlists</h1>
        {sourcePlatform === "Apple Music" ? <>
          <h2>Choose a playlist to transfer</h2>
          <ul className={styles.playlists}>
            
              {loading ? <h3>Loading...</h3> : 
              playlists?.map(playlist => 
                <li key={playlist.id}>
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
          <h2>What playlist would you like to transfer to?</h2>
          <ul className={styles.playlists}>
            
              {loading ? <h3>Loading...</h3> : 
              playlists?.map(playlist => {
                if(playlist.attributes.canEdit) {
                  return <li key={playlist.id}>
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
      </div>
    )
}

export default ApplePlaylists;