import { motion } from 'framer-motion'
import type { LinksFunction } from '@remix-run/node'
import styles from './nav.css'
import { Link } from '@remix-run/react'
import { useState } from 'react'
import { links as HeaderStyles } from '../Hero/hero'
import { Button, links as ButtonStyles } from '~/components/atoms/button'

export const links: LinksFunction = () => [
	{ rel: 'stylesheet', href: styles },
	...HeaderStyles(),
	...ButtonStyles(),
]

const NAV_LINKS = [
	{ to: '/about', name: 'About' },
	{ to: '/work', name: 'Work' },
	{ to: '/news', name: 'News' },
	{ to: '/thinking', name: 'Thinking' },
	{ to: '/contact', name: 'Contact' },
]

const MOBILE_NAV_LINKS = [{ to: '/', name: 'Home' }, ...NAV_LINKS]

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

function MobileNav() {
	const [isOpen, setIsOpen] = useState(false)

	const toggleMenu = () => {
		setIsOpen(!isOpen)
	}

	return (
		<nav className='mobile-nav'>
			<Button
				variant='text'
				isInverse={true}
				type='button'
				onClick={toggleMenu}
			>
				MENU
			</Button>
			<motion.div
				className='mobile-nav-menu'
				animate={isOpen ? 'open' : 'closed'}
				variants={variants}
				initial={'closed'}
			>
				<Button
					variant='text'
					isInverse={false}
					type='button'
					onClick={toggleMenu}
				>
					CLOSE
				</Button>
				<ul>
					{MOBILE_NAV_LINKS.map((link) => (
						<li key={link.to}>
							<Link to={link.to}>{link.name}</Link>
						</li>
					))}
				</ul>
			</motion.div>
		</nav>
	)
}

function DesktopNav() {
	return (
		<nav className='desktop-nav'>
			<ul>
				{NAV_LINKS.map((link) => {
					// if (link.to === '/contact') {
					// 	return (
					// 		<li key={link.to}>
					// 			<Link to={link.to}>
					// 				<Button type='button' variant='contained' isInverse={true}>
					// 					{link.name}
					// 				</Button>
					// 			</Link>
					// 		</li>
					// 	)
					// } else {
					return (
						<li key={link.to}>
							<Link to={link.to}>{link.name}</Link>
						</li>
					)
					// 	}
				})}
			</ul>
		</nav>
	)
}

function NavBar() {
	return (
		<>
			<DesktopNav />
			<MobileNav />
		</>
	)
}

export { NavBar }
