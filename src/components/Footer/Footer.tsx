import { Link } from 'react-router-dom'
import tuneshiftLogo from '../../assets/images/TuneShiftLogo.png'
import styles from './Footer.module.css'
export let Footer = () => {
	return (
		<div className={styles.footer}>

			<div className={styles.links}>
				<div className={styles.secondaryNav}>
					<p className={styles.linkHeader}>TuneShift</p>
					<ul>
						<Link to="/" >Home</Link>
						<Link to="/about" >About</Link>

						<Link to="/future" >Future</Link>
						<Link to="/source" >Transfer</Link>
					</ul>
				</div>
				<div className={styles.help}>
					<p className={styles.linkHeader}>Help</p>
					<ul>
						<Link to="/contact" >Contact</Link>

					</ul>
				</div>


			</div>
			<div className={styles.footerBottom}>
				<p>&copy; ndubcodes</p>
				<img className={styles.tuneshiftLogo} src={tuneshiftLogo} />
			</div>
		</div>
	)
}
