import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

import { Song } from '../types/types'
let Results = () => {

  let location = useLocation();

  let [songsNotFound, setSongsNotFound] = useState<Song[] | null>(null);

  useEffect(() => {
    if (location.state) {
      let songs = location.state.songsNotFound;
      if (songs) {
        setSongsNotFound(songs);
      }
    }
  }, [location.state])
  return (
    <>
      <h2>Transfer complete!</h2>
      {songsNotFound !== null ? <h4>Songs not found: </h4> : null}
      {songsNotFound ?
        <ul>
          {songsNotFound?.map((song, i) => {
            return <li key={i + 1}>Title: {song.name} Artist: {song.artists} Album: {song.album}</li>
          })}
        </ul> : <></>
      }
    </>
  )
}

export default Results;
