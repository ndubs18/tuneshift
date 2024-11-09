import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import styles from './Results.module.css'

import { Song } from '../types/types'
let Results = () => {

  let location = useLocation();

  let [songsNotFound, setSongsNotFound] = useState<Song[] | null>(null);

  useEffect(() => {
    if (location.state) {
      let songs = location.state.songsNotFound;
      if (songs.length !== 0) {
        setSongsNotFound(songs);
      }
    }
  }, [location.state])
  return (
    <div className={styles.results}>
      <h2>Transfer complete!</h2>
      {songsNotFound ? <h4 className={styles.notFoundHeader}>Songs not found: </h4> : null}
      {songsNotFound ?
        <div className={styles.resultsNotFoundContainer}>
          <ul>
            {songsNotFound?.map((song, i) => {
              return <li key={i + 1}><p><b>{song.name}</b> by {song.artists} from {song.album}</p></li>
            })}
          </ul>
        </div> : <></>
      }
    </div>
  )
}

export default Results;
