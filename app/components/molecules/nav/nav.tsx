import type { LinksFunction } from '@remix-run/node'
import { Heading } from '~/components/atoms/Heading/Heading'
import styles from './nav.css'

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: styles }]

function NavBar() {
	return (
		<nav className='navbar-mobile'>
			<Heading className='logo' as='h1'>
				Never Normal
			</Heading>
			<button>MENU</button>
		</nav>
	)
}

export { NavBar }
