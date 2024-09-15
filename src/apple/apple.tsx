import { Song, LibrarySong } from '../types/types'

declare global {
  interface Window {
    MusicKit?: any;
  }
}
//get httpOnly access token from server
//TODO we should rename this or make it more self explanatory
let parseAccessToken = async () => {
  try {
    const response = await fetch('http://localhost:8080/protected', {
      credentials: 'include', // Include cookies with the request
    });

    const data = await response.json();
    const token : string = data.token;
    return token;
  } catch (error) {
    console.error('Error fetching protected data:', error);
  }

}

const handleMusicKitLoaded = async () : Promise<void> => {
  let key = await parseAccessToken();
  try {
    await window.MusicKit.configure({
      developerToken: key, // Replace with your actual developer token
      app: {
        name: 'tuneshift',
        build: '1.0.0',
      }
    });

  } catch (err) {
    // Handle configuration error
    console.error('Error configuring MusicKit:', err);
  }
};

let getApplePlaylists = async () => {
  const music = window.MusicKit.getInstance(); 
  await music.authorize(); 
  const result = await music.api.music('v1/me/library/playlists');
  // let playlists = await result;
  return result;
}

let getApplePlaylistItems = async (playlistId : string) => {
  const music = window.MusicKit.getInstance();
  await music.authorize();
  const result = await music.api.music(`v1/me/library/playlists/${playlistId}/tracks`)
  
  let libraryPlaylistSongs = result.data.data;
  
  return libraryPlaylistSongs;
}

let getApplePlaylistSongIsrcs = async (libraryPlaylistSongs : LibrarySong[]) => {
  let catalogSongs : Song[] = [];
  let songsNotFound : LibrarySong[] = [];

  const music = window.MusicKit.getInstance();
  await music.authorize();
  // let catalogSong = await music.api.music(`v1/me/library/songs/${libraryPlaylistSongs[0].id}/catalog`);
 
  for(const playlistSong of libraryPlaylistSongs) {
    try {

      let catalogSong = await music.api.music(`v1/me/library/songs/${playlistSong.id}/catalog`);
      console.log(catalogSong);

      const name = catalogSong.data.data[0].attributes.name;
      const isrc = catalogSong.data.data[0].attributes.isrc;

      let song : Song = {
        name: name,
        isrc: isrc
      }
      catalogSongs.push(song);
    } catch(e) { 
      songsNotFound.push(playlistSong);
      console.log(e);
    }
  }
  return {catalogSongs: catalogSongs, songsNotFound: songsNotFound};
}

let logOut = async () => {
  const music = window.MusicKit.getInstance();
  await music.unauthorize();
}


//TODO there is a format artwork url function built into musickit
let formatImgUrl = (url : string) => {

  url = url.replace('{w}', '1200');
  url = url.replace('{h}', '1200');
  return url;
}

export { getApplePlaylists, getApplePlaylistItems, getApplePlaylistSongIsrcs, handleMusicKitLoaded, parseAccessToken, formatImgUrl, logOut };