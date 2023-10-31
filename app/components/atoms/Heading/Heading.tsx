import type { ReactNode } from 'react'
import styles from './heading.css'
import type { LinksFunction } from '@remix-run/node'

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: styles }]

interface NewHeadingProps {
	as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5'
	children: ReactNode
	className?: string
	isHero?: boolean
}

function Heading({ className, children, as = 'h1', isHero }: NewHeadingProps) {
	const CustomTag = as as keyof JSX.IntrinsicElements
	return (
		<CustomTag
			className={`${className ? className : ''} ${isHero ? 'hero-copy' : ''}`}
		>
			{children}
		</CustomTag>
	)
}

export { Heading }
