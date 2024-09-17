import { useState, useEffect } from "react";
import { useSource } from "../App"

let Transferring = () => {

    let {sourcePlaylist, setSourcePlaylist } = useSource();
    let [sourcePlatform, setSourcePlatform] = useState<string|null>('');

    let getSearchParams = () : URLSearchParams => {
        let urlSearch = window.location.search;
        let params = new URLSearchParams(urlSearch);
        return params;

    }
    
    useEffect(() => {

        let searchParams = getSearchParams();
        let source = searchParams.get('source');
        setSourcePlatform(source);
        console.log(sourcePlatform)
        console.log(sourcePlaylist)
    })

    
    return (
        <>This is the transferring page</>
    )
}

export default Transferring;