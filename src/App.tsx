// import React from 'react';
import {useState, useEffect} from 'react';
import {Link, useSearchParams, Outlet, useOutletContext} from 'react-router-dom';
import './App.css';

import LoginButton from './components/LoginButton/LoginButton';
import SpotifyLogo from './assets/images/spotify_icon.svg';
import AppleLogo from './assets/images/apple_music_icon.svg'
import BidirectionalArrow from './assets/images/double_arrow_icon.svg'

function App() {

  let [sourcePlatform, setSourcePlatform] = useState<string|null>('');
 
  // TODO we need to manage state globally to handle re-authenticating
  // let [sourceLoggedIn, setSourceLoggedIn] = useState(false);
  // let [targetLoggedIn, setTargetLoggedIn] = useState(false);

  const [searchParams] = useSearchParams();

  
  let setSourcePlatformWrapper = (platform : string) => {
    setSourcePlatform(platform)
  }

  useEffect(() => {
    let source = searchParams.get('source');
    setSourcePlatform(source);
  })

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
          <Outlet context={sourcePlatform}/>
        )
        }
      </header>
    </div>
  );
}

export function useSource() {
  return useOutletContext<string>();
}

export default App;
