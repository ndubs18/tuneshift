import abstractImg from '../assets/images/015.png'
let Home = () => {
  return (

    <header className="main">
      <div className="caption">
        <h1>Transfer Between Spotify and Apple Music</h1>
        <p>Quick and secure solution for transferring between two of the most popular streaming platforms</p>
        <button className="transferButton transferLink">Transfer</button>
      </div>

      <img src={abstractImg} />

    </header>


  )
}

export default Home;
