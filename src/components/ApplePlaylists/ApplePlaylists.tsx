
import {useState, useEffect} from 'react';
import styles from '../../pages/Playlists.module.css';
import PlaylistCard from '../PlaylistCard/PlaylistCard';
import {useSource} from '../../App';

import noArtImg from '../../assets/images/noArtwork.png'

import {getApplePlaylists, handleMusicKitLoaded, formatImgUrl} from '../../apple/apple';
interface IPlaylists {
    data : IPlaylist[];

}
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

    const source = useSource();
    let [playlists, setPlaylists] = useState<IPlaylists | null>(null)

    let [loading, setLoading] = useState(false);

    useEffect(() => {
      console.log(source);
      handleMusicKitLoaded().then(() => {
      setLoading(true);
      // Fetch Apple Music playlist
      let getPlaylists = async () => {
        let data = await getApplePlaylists();
        let playlists = data.data;
        
        setPlaylists(playlists)
        setLoading(false);   
      }

      getPlaylists();
      })
    }, [])
    
    return (
      <div>
        <h1 style={{marginLeft: '2rem'}}>Apple Music Playlists</h1>
        {source === "Apple Music" ? <>
          <h2>Choose a playlist to transfer</h2>
          <ul className={styles.playlists}>
            
              {loading ? <h3>Loading...</h3> : 
              playlists?.data.map(playlist => 
                <li key={playlist.id}>
                  <PlaylistCard playlistId={playlist.id} name={playlist.attributes.name ? playlist.attributes.name : 'null'} sourcePlatform={source} imgUrl={playlist.attributes.artwork?.url ? formatImgUrl(playlist.attributes.artwork?.url) : noArtImg} /> 
                </li>
              )      
              }
          </ul>
          </> :
          <>
          <h2>Choose a playlist to transfer to</h2>
          <ul className={styles.playlists}>
            
              {loading ? <h3>Loading...</h3> : 
              playlists?.data.map(playlist => 
                <li key={playlist.id}>
                  <PlaylistCard playlistId={playlist.id} name={playlist.attributes.name ? playlist.attributes.name : 'null'} sourcePlatform={source} imgUrl={playlist.attributes.artwork?.url ? formatImgUrl(playlist.attributes.artwork?.url) : noArtImg} /> 
                </li>
              )      
              }
          </ul>
          </> 
          

        }
      </div>
    )
}

export default ApplePlaylists;