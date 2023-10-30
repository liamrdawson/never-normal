import type { LinksFunction } from '@remix-run/node'
import styles from './hero-section.css'
import { Button } from '~/components/atoms/button'

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: styles }]

function HeroSection() {
	return (
		<section className='hero-section'>
			<div className='hero'>
				<h1 className='hero-copy'>
					I design, build, and optimise unforgettable online experiences that
					convert
				</h1>
			</div>
			<Button type={'button'} variant='contained' isInverse={false}>
				Let's get started
			</Button>
		</section>
	)
}

export { HeroSection }
