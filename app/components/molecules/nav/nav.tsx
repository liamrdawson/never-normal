import type { LinksFunction } from '@remix-run/node'
import { Heading } from '~/components/atoms/Heading/Heading'
import styles from './nav.css'

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: styles }]

function NavBar() {
	return (
		<nav className='navbar-mobile'>
			<Heading className='nav-text' as='h1'>
				Never Normal
			</Heading>
			<button className='menu-btn nav-text'>MENU</button>
		</nav>
	)
}

export { NavBar }
