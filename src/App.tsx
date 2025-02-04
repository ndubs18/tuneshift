import { useEffect, useState } from 'react'
import { Link, useSearchParams, Outlet, useOutletContext } from 'react-router-dom';
import './App.css';

import { Song } from './types/types';
import Navbar from './components/Navbar/Navbar';
import { Footer } from './components/Footer/Footer';

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

  const [searchParams] = useSearchParams();

  useEffect(() => {
    let source = searchParams.get('source');
    setSourcePlatform(source);

    let sourceSongs = window.localStorage.getItem("sourceSongs")
    let errorSongs = window.localStorage.getItem("errorSongs")

    if (sourceSongs !== null && errorSongs !== null) {
      setSourcePlaylist(JSON.parse(sourceSongs));
      setErrorSongs(JSON.parse(errorSongs))
    }
  })
  return (
    <div className="App">
      <Navbar />
      <div className="container">
        <Outlet context={{ sourcePlatform, sourcePlaylist, errorSongs, setSourcePlaylist } as ContextType} />
      </div>
      <Footer />
    </div>
  );
}
export function useSource() {
  return useOutletContext<ContextType>();
}

export default App;
