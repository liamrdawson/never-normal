import type { LinksFunction } from '@remix-run/node'
import styles from './button.css'

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: styles }]

type ButtonInput = {
	content: string
	name?: string
	value?: string
	type: 'submit' | 'reset' | 'button'
}

export function Button({ content, name, value, type }: ButtonInput) {
	return (
		<button className='border-red' name={name} value={value} type={type}>
			{content}
		</button>
	)
}
