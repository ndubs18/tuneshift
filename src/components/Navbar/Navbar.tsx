import { Link } from 'react-router-dom'
import TuneshiftLogo from '../../assets/images/TuneShiftLogo.png'
let Navbar = () => {
	return (

		<nav>
			<ul>
				<img src={TuneshiftLogo} />
				<li><Link to='/'>Home</Link></li>
				<li><Link to='about'>About</Link></li>
				<li><Link to='future'>Future</Link></li>
			</ul>
			<Link className="transferLink" to='source'>Transfer</Link>
		</nav>

	)
}

export default Navbar;
