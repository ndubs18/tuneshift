// import React from 'react';
import { useState, useEffect } from 'react';
import { Link, useSearchParams, Outlet, useOutletContext } from 'react-router-dom';
import './App.css';

import LoginButton from './components/LoginButton/LoginButton';
import SpotifyLogo from './assets/images/spotify_icon.svg';
import AppleLogo from './assets/images/apple_music_icon.svg'
import BidirectionalArrow from './assets/images/double_arrow_icon.svg'
import { Song } from './types/types';

type ContextType = {
  sourcePlatform: string | null,
  sourcePlaylist: Song[] | null,
  errorSongs: Song[] | null;
  setSourcePlaylist: (songs: Song[]) => void,
}

function App() {

  let [sourcePlatform, setSourcePlatform] = useState<string | null>("");
  let [sourcePlaylist, setSourcePlaylist] = useState<Song[]>([]);
  let [errorSongs, setErrorSongs] = useState<Song[] | null>([]);

  // TODO we need to manage state globally to handle re-authenticating
  // let [sourceLoggedIn, setSourceLoggedIn] = useState(false);
  // let [targetLoggedIn, setTargetLoggedIn] = useState(false);

  const [searchParams] = useSearchParams();


  let setSourcePlatformWrapper = (platform: string) => {
    setSourcePlatform(platform)
  }
  // ? Do we send setState hook down the hierarchy of our components or use context like with did with source?
  // * We decided to use useContext to pass this down.
  // let setSourcePlaylistWrapper = (songs : string[] | null) => {
  //   setSourcePlaylist(songs);
  // }

  useEffect(() => {
    let source = searchParams.get('source');
    setSourcePlatform(source);

    //! We need to find an alternative to using the non-null assertion operator '!'
    //* We can probably just check if the value is null before passing it to JSON parse?

    let sourceSongs = window.localStorage.getItem("sourceSongs")
    let errorSongs = window.localStorage.getItem("errorSongs")

    if (sourceSongs !== null && errorSongs !== null) {
      setSourcePlaylist(JSON.parse(sourceSongs));
      setErrorSongs(JSON.parse(errorSongs))
    }

  }, [sourcePlatform])

  return (
    <div className="App">
      <Link to="/" onClick={() => {
        setSourcePlatform("");
      }}><h1 className='navTitle'>TuneShift</h1>
      </Link>
      <header className="App-header">
        {sourcePlatform == null ? (
          <>
            <h3 className='selectSourceHeader'>Select the source platform</h3>
            <div className='sourceSelection'>
              <div className='sourceCard'>
                <img src={SpotifyLogo} alt="spotify" />
                <LoginButton name="Spotify" setSourcePlatform={setSourcePlatformWrapper} />
              </div>
              <span><img src={BidirectionalArrow} alt="arrow" /></span>
              <div className='sourceCard'>
                <img src={AppleLogo} alt="apple music" />
                <LoginButton name="Apple Music" setSourcePlatform={setSourcePlatformWrapper} />
              </div>
            </div>
          </>) : (
          <Outlet context={{ sourcePlatform, sourcePlaylist, errorSongs, setSourcePlaylist } as ContextType} />
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
