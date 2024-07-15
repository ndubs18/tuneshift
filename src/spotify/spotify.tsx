import {Profile} from '../types/types';

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

    return data;

}

export let getPlaylistItems = async (playlist_id = '') => {
    let response = await fetch(`${baseSpotifyAPI}/${playlist_id}/tracks`)
    let data = await response.json();

    return data.items;
}

type Track = {
    external_ids: {
        isrc: string;
    }
}

export let getPlaylistItemCodes = ((tracks : Track[]) => {
    let isrcList : string[] = [] 
    tracks.forEach((track : Track) => isrcList.push(track.external_ids.isrc))
    return isrcList;
    
})