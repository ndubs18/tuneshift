import { Link } from 'react-router-dom'
import TuneshiftLogo from '../../assets/images/TuneShiftLogo.png'
let Navbar = () => {
	return (

		<nav>
			<ul>
				<Link to='/' onClick={() => {
				}}><img src={TuneshiftLogo} />
				</Link>
				<li><Link to='about'>About</Link></li>
				<li><Link to='plans'>Plans</Link></li>
			</ul>
			<Link className="transferLink" to='source'>Transfer</Link>
		</nav>

	)
}

export default Navbar;
