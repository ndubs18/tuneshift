import abstractImg from '../assets/images/015.png'
//import jsIllust from '../assets/images/javascript_illustration.svg'
import jsIllust from '../assets/images/toolllust.svg'

import styles from './Home.module.css'
let Home = () => {
  return (
    <>
      <div className={styles.hero}>
        <div className={styles.caption}>
          <h1>Transfer Between Spotify and Apple Music</h1>
          <p>Quick and secure solution for transferring between two of the most popular streaming platforms</p>
          <button className={styles.transferButton + " " + styles.transferLink}>Get Started</button>
        </div>
        <img src={abstractImg} />
      </div>

      <section className={styles.what}>
        <div className={styles.whatContent}>
          <div className={styles.illust}>
            <img src={jsIllust} />
          </div>
          <div>
            <h1 className={styles.question}> What is TuneShift? </h1>
            <p className={styles.desc}> TuneShift is a side project created by a music enthusiast who wanted to share playlists with friends who exist on different streaming platforms. They figured why not get the best of both worlds but without the hassle of moving music manually.</p>
          </div>
        </div>
      </section>
    </>

  )
}

export default Home;
