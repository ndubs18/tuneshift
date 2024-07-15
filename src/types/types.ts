export type Profile = {
    display_name : string,
    id : string
}

//TODO we should add to this to share between playlist components
//type used for Playlist components
export type PlaylistProps = {
    setSourcePlaylist : (songs : string[]) => void
}