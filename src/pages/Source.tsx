import { useState, useEffect } from 'react';
import './Source.module.css';
import { Link, useSearchParams, Outlet, useOutletContext } from 'react-router-dom';

import styles from './Source.module.css';
import { Song } from '../types/types';
import { SourceCard } from '../components/SourceCard/SourceCard';

type ContextType = {
  sourcePlatform: string | null,
  sourcePlaylist: Song[] | null,
  errorSongs: Song[] | null;
  setSourcePlaylist: (songs: Song[]) => void,
}
export let Source = () => {


  let [sourcePlatform, setSourcePlatform] = useState<string | null>("");
  let [sourcePlaylist, setSourcePlaylist] = useState<Song[]>([]);
  let [errorSongs, setErrorSongs] = useState<Song[] | null>([]);

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
    <section className={styles.source}>
      {sourcePlatform == null ? (
        <>
          <h1 className={styles.selectSourceHeader}>Source Platform</h1>
          <h2 className={styles.selectSourceSecondary}>Where would you like to transfer from?</h2>
          <div className={styles.sourceSelection}>
            <SourceCard platform="Spotify" setSourcePlatform={setSourcePlatformWrapper} />
            <SourceCard platform="Apple Music" setSourcePlatform={setSourcePlatformWrapper} />
          </div>
        </>) : (
        <Outlet context={{ sourcePlatform, sourcePlaylist, errorSongs, setSourcePlaylist } as ContextType} />
      )
      }
    </section>
  )
}
export function useSource() {
  return useOutletContext<ContextType>();
}

