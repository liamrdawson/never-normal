import { motion } from 'framer-motion'
import type { LinksFunction } from '@remix-run/node'
import { Heading } from '~/components/atoms/Heading/Heading'
import styles from './nav.css'
import { Link } from '@remix-run/react'
import { useState } from 'react'

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: styles }]

const FACE = [
	{ to: '/', name: 'Home' },
	{ to: '/about', name: 'About' },
	{ to: '/work', name: 'Work' },
	{ to: '/news', name: 'News' },
	{ to: '/thinking', name: 'Thinking' },
	{ to: '/contact', name: 'Contact' },
]

const variants = {
	open: {
		x: 0,
		transition: {
			duration: 0.15,
			bounce: 0,
			ease: 'circOut',
		},
	},
	closed: {
		x: '100%',
		transition: {
			duration: 0.15,
			bounce: 0.5,
			ease: 'circIn',
		},
	},
}

function NavMenu({
	isOpen,
	toggleMenu,
}: {
	isOpen: boolean
	toggleMenu: () => void
}): JSX.Element {
	return (
		<motion.div
			className='nav-menu-links'
			animate={isOpen ? 'open' : 'closed'}
			variants={variants}
			initial={'closed'}
		>
			<div className='mobile-menu-close-button-container'>
				<button className='menu-btn close' onClick={toggleMenu}>
					CLOSE
				</button>
			</div>
			<ul>
				{FACE.map((link) => (
					<li key={link.to}>
						<Link to={link.to}>{link.name}</Link>
					</li>
				))}
			</ul>
		</motion.div>
	)
}

function NavBar() {
	const [isOpen, setIsOpen] = useState(false)

	const toggleMenu = () => {
		setIsOpen(!isOpen)
	}
	return (
		<nav className='navbar-mobile'>
			<Heading className='logo' as='h1'>
				Never Normal
			</Heading>
			<button className='menu-btn' onClick={toggleMenu}>
				MENU
			</button>
			<NavMenu isOpen={isOpen} toggleMenu={toggleMenu} />
		</nav>
	)
}

export { NavBar }
