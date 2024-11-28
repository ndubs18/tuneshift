import './LoginButton.modules.css'
interface Props {
    name: string;
    setSourcePlatform: (platform: string) => void
}

let LoginButton = ({ name, setSourcePlatform }: Props) => {
    return (
        <button onClick={() => {
            setSourcePlatform(name);
            window.location.assign(`${process.env.REACT_APP_AUTH_SERVER_URI}/login/${name === 'Spotify' ? 'spotify' : 'apple'}?source=${name}`)
        }}>{name}</button>

    )
}

export default LoginButton;
