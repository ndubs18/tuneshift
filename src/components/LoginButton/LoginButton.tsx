
interface Props {
    name: String;
 }

let LoginButton : React.FC<Props>= ({name}) => {
    return (
        <button onClick={() => {
            window.location.replace(`http://localhost:8080/login/${name === 'Spotify' ? 'spotify' : 'apple'}`)
        }}>{name}</button>
 
    )
}

export default LoginButton;