import {Profile, Song} from '../types/types';

let baseSpotifyAPI = "https://api.spotify.com/v1";

export let parseAccessToken = () => {
    let cookie : string[] = document.cookie.split('=');
    let accessToken : string | undefined = cookie.at(1);

    return accessToken;

}
export let getCurrentUserProfile = async () : Promise<Profile> => {
    let accessToken = parseAccessToken();

    let profile : Profile;

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
    let accessToken = parseAccessToken();
    let response = await fetch(`${baseSpotifyAPI}/me/playlists`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })

    let data = await response.json()
    console.log(data);
    return data;

}
export let getSpotifyPlaylist = async (playlistId : string) => {
    let accessToken = parseAccessToken();

    let response = await fetch(`${baseSpotifyAPI}/playlists/${playlistId}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });
    
    return response.json();
}
export let getSpotifyPlaylistSongs = async (playlistId : string) : Promise<Song[][]>=> {
    let songList : Song[][] = [];

    let accessToken = parseAccessToken();
    
    let response = await fetch(`${baseSpotifyAPI}/playlists/${playlistId}/tracks?market=US`, {
        headers : {
            Authorization: `Bearer ${accessToken}`
        }
    })
    let data = await response.json();
    //is there more than 100 songs
    let next = data.next;    
    let songs = data.items;   
    let songPage = []

    for (const song of songs) {

        let artists = [];

        for(const artist of song.track.artists) {
            artists.push(artist.name)
        }

        let artistsString = artists.join(" ")
        
        let item : Song = {
            name : song.track.name,
            artists : artistsString,
            isrc : song.track.external_ids.isrc
        }
        songPage.push(item)
    }

    songList.push(songPage);

    //while there is more than one page (100 songs)
    while(next) {
        songPage = []
        let response = await fetch(`${next}`, {
            headers : {
                Authorization: `Bearer ${accessToken}`
            }
        }) 


        data = await response.json();
        next = data.next;
        
        songs = data.items;

        for (const song of songs) {

            let artists = [];
    
            for(const artist of song.track.artists) {
                artists.push(artist.name)
            }
    
            let artistsString = artists.join(" ")
            
            let item : Song = {
                name : song.track.name,
                artists : artistsString,
                isrc : song.track.external_ids.isrc
            }
            songPage.push(item)
        }
        songList.push(songPage);
    }

    return songList;
}

export let getSongIdList = ((song : Song[]) => {
    let idList : string[] = [] 
    song.forEach((song : Song) => {
        if(typeof song.id === "string") {
            idList.push(song.id)
        }
    })
    return idList;
    
})

export let getSpotifyCatalogSongIds = async (songs : Song[][]) => {
    let songsWithIds : Song[][] = [];
    let accessToken = parseAccessToken();
 
    for(const page of songs) {
        let pageOfSongs = [];
        for(const song of page) {
            let q = `q=track: ${song.name} artist: ${song.artists} isrc: ${song.isrc} track`
        
            try {
            let response = await fetch(`${baseSpotifyAPI}/search?${q}&type=track`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }})
                let data = await response.json();
                let songWithId : Song = Object.create(song);
                songWithId.id = data.tracks.items[0].uri
                pageOfSongs.push(songWithId);
            } catch (error) {
                console.log(error);
            }
            
        }
        songsWithIds.push(pageOfSongs);
    }

    return songsWithIds;
}

export let addToSpotifyPlaylist = async (songs : Song[][], playlistId : string) => {
    let response;
    let accessToken = parseAccessToken();

   for(const page of songs) {
    let idList = getSongIdList(page);
    try {
            response = await fetch(`${baseSpotifyAPI}/playlists/${playlistId}/tracks`, {
                method: "POST",
                body: JSON.stringify({uris: idList}),
                headers: {
                    Authorization: `Bearer  ${accessToken}`
                }
            })

        } catch(error) {
            console.log(error);
        }
    }
    return response;
}
