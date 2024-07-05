
interface Props {
    name: string;
    setSourcePlatform: ( platform : string ) => void
 }

let LoginButton = ({name, setSourcePlatform = ()=> {}} : Props) => {
    return (
        <button onClick={() => {
            setSourcePlatform(name);
            window.location.replace(`http://localhost:8080/login/${name === 'Spotify' ? 'spotify' : 'apple'}`)
        }}>{name}</button>
 
    )
}

export default LoginButton;