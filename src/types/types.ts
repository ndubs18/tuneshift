export type Profile = {
    display_name: string,
    id: string
}

export type Song = {
    name: string,
    artists: string,
    album: string,
    releaseDate?: string,
    isrc?: string,
    id?: string
}

export type LibrarySong = {
    id: string;
    attributes: {
        name: string,
        artistName: string,
        album: string,
        playParams: {
            catalogId: string
        }
    }
}
//TODO we should add to this to share between playlist components
//type used for Playlist components
export type PlaylistProps = {
    setSourcePlaylist: (songs: string[]) => void
}
