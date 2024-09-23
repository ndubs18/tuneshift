import { Song, LibrarySong } from '../types/types'

declare global {
  interface Window {
    MusicKit: any;
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
 
  for(const playlistSong of libraryPlaylistSongs) {
    try {

      let catalogSong = await music.api.music(`v1/me/library/songs/${playlistSong.id}/catalog`);
      console.log(catalogSong);
      const name = catalogSong.data.data[0].attributes.name;
      const artists = catalogSong.data.data[0].attributes.artistName;
      const isrc = catalogSong.data.data[0].attributes.isrc;

      let song : Song = {
        name: name,
        artists : artists, 
        isrc: isrc,
      }
      catalogSongs.push(song);
    } catch(e) { 
      songsNotFound.push(playlistSong);
      console.log(e);
    }
  }
  return {appleCatalogSongs: catalogSongs, songsNotFound: songsNotFound};
}

let getSongIsrcListString = (songs : Song[]) => {
  let isrcList = [];
  for(const song of songs) {
    isrcList.push(song.isrc);
  }

  let isrcString = isrcList.join(',')
  return isrcString;
}

let formatSongsProperty = (catalogSongs : {id : string, type : string}[]) => {
  let songsToAdd = [];

  for(const song of catalogSongs) {
    let songToAdd = Object.create(null);
    songToAdd.id = song.id;
    songToAdd.type = song.type
    songsToAdd.push(songToAdd)
  }

  return songsToAdd;
}
export let addToApplePlaylist = async (targetPlaylistId: string, songs : Song[]) => {
  const music = window.MusicKit.getInstance();
  await music.authorize();

  let accessToken = await parseAccessToken();

  let isrcString = getSongIsrcListString(songs);
  
  let songsResponseByIsrc = await music.api.music(`/v1/catalog/us/songs?filter[isrc]=${isrcString}`)
  
  let songsProp = formatSongsProperty(songsResponseByIsrc.data.data);

  try {
  let userToken = await music.authorize();
  let response = await fetch(`https://api.music.apple.com/v1/me/library/playlists/${targetPlaylistId}/tracks`, {
      method: "POST",
      body: JSON.stringify({data: songsProp}),
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Music-User-Token': userToken,
        'Content-Type': 'application/json',
      }
    })
  }
  catch(error) {
    console.log(error);
  }
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