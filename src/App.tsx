// import React from 'react';
import {useState, useEffect} from 'react';
import {Link, useSearchParams, Outlet, useOutletContext} from 'react-router-dom';
import './App.css';

import LoginButton from './components/LoginButton/LoginButton';
import SpotifyLogo from './assets/images/spotify_icon.svg';
import AppleLogo from './assets/images/apple_music_icon.svg'
import BidirectionalArrow from './assets/images/double_arrow_icon.svg'

type ContextType = {
  sourcePlatform : string | null,
  sourcePlaylist : string[] | null;
  setSourcePlaylist : (songs : string[]) => void
}

function App() {

  let [sourcePlatform, setSourcePlatform] = useState<string | null>('');
  let [targetPlatform, setTargetPlatform] = useState<string | null>('')

  let [sourcePlaylist, setSourcePlaylist] = useState<string[]>([])
 
  // TODO we need to manage state globally to handle re-authenticating
  // let [sourceLoggedIn, setSourceLoggedIn] = useState(false);
  // let [targetLoggedIn, setTargetLoggedIn] = useState(false);

  const [searchParams] = useSearchParams();

  
  let setSourcePlatformWrapper = (platform : string) => {
    setSourcePlatform(platform)
  }
  // ? Do we send setState hook down the hierarchy of our components or use context like with did with source?
  // let setSourcePlaylistWrapper = (songs : string[] | null) => {
  //   setSourcePlaylist(songs);
  // }

  useEffect(() => {
    let source = searchParams.get('source');
    setSourcePlatform(source);
    //let songs = window.localStorage.getItem("songs");
    setSourcePlaylist(JSON.parse(window.localStorage.getItem("songs")!));
  },[])

  return (
    <div className="App">
      <Link to="/"><h1>TuneShift</h1></Link>
      <header className="App-header"> 
        {sourcePlatform !== "Spotify" && sourcePlatform !== "Apple Music" ? 
        
        (<>
        <h4>Select the source platform</h4>
       <div className='sourceSelection'>
          <div className='sourceCard'>
            <img src={SpotifyLogo} alt="spotify" />
            <LoginButton name="Spotify" setSourcePlatform={setSourcePlatformWrapper}/>
          </div>
          <span><img src={BidirectionalArrow} alt="arrow"/></span>  
          <div className='sourceCard'>
            <img src={AppleLogo} alt="apple music" />
            <LoginButton name="Apple Music" setSourcePlatform={setSourcePlatformWrapper}/>
          </div>
        </div></>) : (
          <Outlet context={{sourcePlatform, sourcePlaylist, setSourcePlaylist} satisfies ContextType}/>
        )
        }
      </header>
    </div>
  );
}

export function useSource() {
  return useOutletContext<ContextType>();
}

export default App;
