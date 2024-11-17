import { Profile, Song } from '../types/types';

let baseSpotifyAPI = "https://api.spotify.com/v1";

export let parseAccessToken = () => {
    let cookie: string[] = document.cookie.split('=');
    let accessToken: string | undefined = cookie.at(1);

    return accessToken;

}
export let getCurrentUserProfile = async (): Promise<Profile> => {
    let accessToken = parseAccessToken();

    let profile: Profile;

    let response = await fetch(`${baseSpotifyAPI}/me`, {
        headers: {
            Authorization: `Bearer  ${accessToken}`
        }
    })

    let data = await response.json();
    profile = data;
    return profile;
}

export let getCurrentUsersPlaylits = async () => {
    let accessToken = await parseAccessToken();
    let response = await fetch(`${baseSpotifyAPI}/me/playlists`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })

    let data = await response.json()
    return data;

}
export let getSpotifyPlaylist = async (playlistId: string) => {
    let accessToken = parseAccessToken();

    let response = await fetch(`${baseSpotifyAPI}/playlists/${playlistId}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });

    return response.json();
}
export let getSpotifyPlaylistSongs = async (playlistId: string): Promise<Song[][]> => {
    let songList: Song[][] = [];

    let accessToken = parseAccessToken();

    let response = await fetch(`${baseSpotifyAPI}/playlists/${playlistId}/tracks?market=US`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        }
    })
    let data = await response.json();
    //is there more than 100 songs
    let next = data.next;
    let songs = data.items;
    let songPage = []

    for (const song of songs) {

        let artists = [];

        for (const artist of song.track.artists) {
            artists.push(artist.name)
        }

        let artistsString = artists.join(" ")

        let item: Song = {
            name: song.track.name,
            artists: artistsString,
            album: song.track.album.name,
            releaseDate: song.track.album.release_date,
            isrc: song.track.external_ids.isrc
        }
        songPage.push(item)
    }

    songList.push(songPage);

    //while there is more than one page (100 songs)
    while (next) {
        songPage = []
        let response = await fetch(`${next}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })

        data = await response.json();
        next = data.next;

        songs = data.items;

        for (const song of songs) {

            let artists = [];

            for (const artist of song.track.artists) {
                artists.push(artist.name)
            }

            let artistsString = artists.join(" ")

            let item: Song = {
                name: song.track.name,
                artists: artistsString,
                album: song.track.album,
                isrc: song.track.external_ids.isrc
            }
            songPage.push(item)
        }
        songList.push(songPage);
    }

    return songList;
}

export let getSongIdList = ((song: Song[]) => {
    let idList: string[] = []
    song.forEach((song: Song) => {
        if (typeof song.id === "string") {
            idList.push(song.id)
        }
    })
    return idList;

})

let parseYear = (date: string): string => {
    let expandedYear = date.split('-');
    return expandedYear[0];
}

export let getSpotifyCatalogSongIds = async (songs: Song[][]): Promise<[Song[][], Song[]]> => {
    let songsWithIds: Song[][] = [];
    let accessToken = parseAccessToken();
    let songsNotFound: Song[] = [];
    for (const page of songs) {
        let pageOfSongs = [];
        for (const song of page) {

            let year;

            if (song.releaseDate) {
                year = parseYear(song.releaseDate);
            }
            let q = `q=isrc:${song.isrc}`

            try {
                let response = await fetch(`${baseSpotifyAPI}/search?${q}&type=track`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                })
                let data = await response.json();
                //if the song we want is the first resultA
                if (data.tracks.items[0].external_ids.isrc === song.isrc) {
                    let songWithId: Song = Object.create(song);
                    songWithId.id = data.tracks.items[0].uri
                    pageOfSongs.push(songWithId);
                }
                //seearch through the remainder of results on page
                else {
                    let songResults = data.tracks.items;
                    let songFound: boolean = false;
                    let next: string = data.tracks.next;

                    for (const resultSong of songResults) {
                        if (resultSong.external_ids.isrc === song.isrc) {
                            let songWithId: Song = Object.create(song);
                            songWithId.id = resultSong.uri
                            pageOfSongs.push(songWithId);
                            songFound = true;
                            break;
                        }
                    }
                    //if there is more than one page of results
                    //and we still haven't found the song
                    while (next && !songFound) {
                        let response = await fetch(`${next}`, {
                            headers: {
                                Authorization: `Bearer ${accessToken}`
                            }
                        })
                        data = await response.json();
                        let songResults = data.tracks.items;
                        next = data.tracks.next
                        for (const resultSong of songResults) {
                            if (resultSong.external_ids.isrc === song.isrc) {
                                let songWithId: Song = Object.create(song);
                                songWithId.id = resultSong.uri
                                pageOfSongs.push(songWithId);
                                songFound = true;
                                break;
                            }
                        }
                    }
                    if (!songFound) {
                        songsNotFound.push(song);
                    }
                }
            } catch (error) {
                songsNotFound.push(song);
                console.log(error);
            }

        }
        songsWithIds.push(pageOfSongs);
    }
    return [songsWithIds, songsNotFound];
}

export let getSpotifyPlaylistInfo = (playlist: Song[][]) => {
    let numSongs = 0;
    let songs: Song[] = [];
    for (const page of playlist) {
        numSongs += page.length;
        for (const song of page) {
            let songToAdd: Song = {
                name: song.name,
                artists: song.artists,
                album: song.album
            }

            songs.push(songToAdd)
        }
    }

    return { numSongs: numSongs, songsToTransfer: songs }
}

export let addToSpotifyPlaylist = async (songs: Song[][], playlistId: string) => {
    let response;
    let accessToken = parseAccessToken();

    for (const page of songs) {
        let idList = getSongIdList(page);
        try {
            response = await fetch(`${baseSpotifyAPI}/playlists/${playlistId}/tracks`, {
                method: "POST",
                body: JSON.stringify({ uris: idList }),
                headers: {
                    Authorization: `Bearer  ${accessToken}`
                }
            })

        } catch (error) {
            console.log(error);
        }
    }
    return response;
}
