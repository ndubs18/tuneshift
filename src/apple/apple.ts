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
    const response = await fetch('/protected', {
      credentials: 'include', // Include cookies with the request
    });

    const data = await response.json();
    const token: string = data.token;
    return token;
  } catch (error) {
    console.error('Error fetching protected data:', error);
  }
}

const handleMusicKitLoaded = async (): Promise<void> => {
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

  let playlistsToReturn = [];
  const music = window.MusicKit.getInstance();
  await music.authorize();
  const result = await music.api.music('v1/me/library/playlists');
  playlistsToReturn = result.data.data;
  let next = result.data.next
  while (next) {
    const music = window.MusicKit.getInstance();
    await music.authorize();
    const result = await music.api.music(`${next}`);
    playlistsToReturn.push(...result.data.data)
    next = result.data.next;
  }

  return playlistsToReturn;
}

let getApplePlaylistItems = async (playlistId: string) => {

  let playlistItems = [];
  const music = window.MusicKit.getInstance();
  await music.authorize();

  const result = await music.api.music(`v1/me/library/playlists/${playlistId}/tracks`)
  playlistItems.push(result.data.data)
  let next = result.data.next;

  while (next) {
    const music = window.MusicKit.getInstance();
    await music.authorize();
    const result = await music.api.music(`${next}`);
    playlistItems.push(result.data.data)
    next = result.data.next;
  }
  return playlistItems;
}

let curatePlaylistItemsIds = (librarySongs: LibrarySong[][]) => {
  let songIds = [];
  let pageOfIds = []
  for (const page of librarySongs) {
    pageOfIds = []
    for (const song of page) {
      pageOfIds.push(song.attributes.playParams.catalogId);
    }
    songIds.push(pageOfIds);
  }
  return songIds;
}

let getApplePlaylistSongIsrcs = async (songs: LibrarySong[][]) => {

  let isrcList: Song[][] = [];
  let curatedIdList = curatePlaylistItemsIds(songs)

  for (const curatedPage of curatedIdList) {
    let pageOfSongsWithIsrc = [];
    const music = window.MusicKit.getInstance();
    await music.authorize();
    let result = await music.api.music(`/v1/catalog/US?ids[songs]=${curatedPage}`)
    let catalogSongs = result.data.data;
    for (const catalogSong of catalogSongs) {
      let song: Song = {
        name: catalogSong.attributes.name,
        artists: catalogSong.attributes.artistName,
        album: catalogSong.attributes.albumName,
        releaseDate: catalogSong.attributes.releaseDate,
        isrc: catalogSong.attributes.isrc,
      }
      pageOfSongsWithIsrc.push(song);
    }
    isrcList.push(pageOfSongsWithIsrc);
  }

  return isrcList;
}

//functions below this line are for transferring from spotify -> apple music
let getSongIsrcListString = (songs: Song[][]) => {
  let isrcStringList = [];
  for (const page of songs) {
    if (page.length > 25) {
      let numSubPages = Math.ceil(page.length / 25)
      for (let i = 0; i < numSubPages; i++) {
        let subPage = [];
        for (let j = i * 25; j < (i * 25) + 25 && j < page.length; j++) {
          subPage.push(page[j].isrc)
        }
        isrcStringList.push(subPage.join(','))
      }
    }
    else {
      let subPage = []
      for (const song of page) {
        subPage.push(song.isrc)
      }
      isrcStringList.push(subPage.join(','))
    }
  }
  return isrcStringList;

}

//TODO let's create a type for the filter.isrc object returned from songResponseByIsrc
let formatSongsProperty = (catalogSongs: any, songsNotFound: string[]) => {
  let songsToAdd = [];

  for (const song in catalogSongs) {
    if (catalogSongs[song][0]) {
      let songToAdd = Object.create(null);
      songToAdd.id = catalogSongs[song][0].id;
      songToAdd.type = catalogSongs[song][0].type;
      songsToAdd.push(songToAdd);
    }
    else {
      songsNotFound.push(song);
    }
  }
  return songsToAdd;

}

export let addToApplePlaylist = async (targetPlaylistId: string, songs: Song[][]): Promise<string[]> => {
  const music = window.MusicKit.getInstance();
  await music.authorize();

  let accessToken = await parseAccessToken();
  let formattedIsrcStringList = getSongIsrcListString(songs);
  let songsNotFound: string[] = [];
  for (const isrcString of formattedIsrcStringList) {
    let songsResponseByIsrc = await music.api.music(`/v1/catalog/us/songs?filter[isrc]=${isrcString}`)
    let songsFilterObject = songsResponseByIsrc.data.meta.filters.isrc;
    let songsProp = formatSongsProperty(songsFilterObject, songsNotFound);

    try {
      let userToken = await music.authorize();
      let response = await fetch(`https://api.music.apple.com/v1/me/library/playlists/${targetPlaylistId}/tracks`, {
        method: "POST",
        body: JSON.stringify({ data: songsProp }),
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Music-User-Token': userToken,
          'Content-Type': 'application/json',
        }
      })
    }
    catch (error) {
      console.log(error);
    }
  }
  return songsNotFound;
}

let getApplePlaylistInfo = (playlist: LibrarySong[][]) => {
  let numSongs = 0;
  let songs: Song[] = [];

  for (const page of playlist) {
    numSongs += page.length;
    for (const song of page) {
      let songToAdd: Song = {
        name: song.attributes.name,
        artists: song.attributes.artistName,
        album: song.attributes.album
      }
      songs.push(songToAdd)
    }
  }

  return { numSongs: numSongs, songsToTransfer: songs }
}

let logOut = async () => {
  const music = window.MusicKit.getInstance();
  await music.unauthorize();
}

let getSongsNotFoundData = () => {

}
//TODO there is a format artwork url function built into musickit
let formatImgUrl = (url: string) => {

  url = url.replace('{w}', '1200');
  url = url.replace('{h}', '1200');
  return url;
}

export { getApplePlaylists, getApplePlaylistItems, getApplePlaylistSongIsrcs, getApplePlaylistInfo, handleMusicKitLoaded, parseAccessToken, formatImgUrl, logOut };
