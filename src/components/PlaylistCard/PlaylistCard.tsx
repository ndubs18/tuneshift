import './PlaylistCard.module.css'
export default function PlaylistCard({name, imgUrl}
    : {
        name: string,
        imgUrl: string
    }
) {

    return (
        <div className='playlistCard'>
            <img src={imgUrl} alt={name} />
            <h4>{name}</h4>
        </div>
    )
}