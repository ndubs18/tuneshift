let baseSpotifyAPI = "https://api.spotify.com/v1";

// TODO We need to store and retrieve this toke sfrom server sessions instead of url
export let parseAccessToken = () => {
    let cookie : string[] = document.cookie.split('=');
    let accessToken : string | undefined = cookie.at(1);

    return accessToken;

}
export let getCurrentUserProfile : object = async () => {
    let accessToken = parseAccessToken();
    let profile = {};

    await fetch(`${baseSpotifyAPI}/me`, {
        headers: {
            Authorization: `Bearer  ${accessToken}`
        }
    }).then(res => res.json())
    .then(data => profile = data);

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

    //mock data return from playlists endpoint
    // let data = {
    //     items: [{name: "kaythenbounce", images: [{url: "image1"}]}, 
    //             {name: "mayem", images: [{url: "image2"}]},
    //             {name: "test", images: [{url: "image3"}]}
    //     ]
    // }
    return data;

}

export let getPlaylistItems = async (playlist_id = '') => {
    let accessToken = parseAccessToken();
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