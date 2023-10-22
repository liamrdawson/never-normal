import type { LinksFunction } from '@remix-run/node'
import { Heading } from '~/components/atoms/Heading/Heading'
import styles from './header.css'

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: styles }]

type Props = {
	headerCopy: string
}

function Header({ headerCopy }: Props) {
	return (
		<header>
			<Heading className={'headerCopy'}>{headerCopy}</Heading>
		</header>
	)
}

export { Header }
