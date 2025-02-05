import construction from '../assets/images/construct.jpg'
import styles from './Construction.module.css'

let Construction = () => {
  return (
    <div className={styles.constructionContainer}><img className={styles.constructionImg} src={construction} /></div>
  )
}

export default Construction;
