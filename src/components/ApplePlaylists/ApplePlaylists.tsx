
import {useState, useEffect} from 'react';
import styles from '../../pages/Playlists.module.css';
import PlaylistCard from '../PlaylistCard/PlaylistCard';

import noArtImg from '../../assets/images/noArtwork.png'

import {getApplePlaylists, handleMusicKitLoaded, parseAccessToken, formatImgUrl} from '../../apple/apple';
interface IPlaylists {
    data : IPlaylist[];

}
interface IPlaylist {
    name : string,
    id : string;
    attributes : { 
        artwork? : {url : string},
        name : string
    }
} 
let ApplePlaylists = () => {

    let [playlists, setPlaylists] = useState<IPlaylists | null>(null)
    const [isMusicKitLoaded, setIsMusicKitLoaded] = useState(false);


    useEffect(() => {
      handleMusicKitLoaded().then(() => {
      // Fetch Apple Music playlists
      let getPlaylists = async () => {
        let data = await getApplePlaylists();
        let playlists = data.data;

        setPlaylists(playlists)
        
      }

      getPlaylists();
      })

      
  
      // Add the event listener for musickitloaded
      //document.addEventListener('musickitloaded', handleMusicKitLoaded);
  
      // Clean up the event listener on component unmount
      // return () => {
      // document.removeEventListener('musickitloaded', handleMusicKitLoaded);
      // };
    }, [])
    
    return (
        <div>
        <h1 style={{marginLeft: '2rem'}}>Apple Music Playlists</h1>
        <h2>Choose a playlist to transfer</h2>
        <ul className={styles.playlists}>
            {playlists?.data.map(playlist => <li key={playlist.id}>
                <PlaylistCard  playlistId={playlist.id} name={playlist.attributes.name ? playlist.attributes.name : 'null'} imgUrl={playlist.attributes.artwork?.url ? formatImgUrl(playlist.attributes.artwork?.url) : noArtImg}/> 
                </li>
                )
            }
        </ul>
    </div>
    )
}

export default ApplePlaylists;