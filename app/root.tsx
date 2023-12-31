import { cssBundleHref } from '@remix-run/css-bundle'
import type { LinksFunction } from '@remix-run/node'
import {
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from '@remix-run/react'
import reset from './styles/reset.css'
import theme from './styles/theme.css'
import styles from './global.css'
import { links as NavBarLinks } from './components/molecules/nav/nav'
import {
	Header,
	links as headerLinks,
} from './components/organisms/Header/Header'

export const links: LinksFunction = () => [
	...(cssBundleHref ? [{ rel: 'stylesheet', href: cssBundleHref }] : []),
	{ rel: 'stylesheet', href: reset },
	{ rel: 'stylesheet', href: theme },
	{ rel: 'stylesheet', href: styles },
	...headerLinks(),
	...NavBarLinks(),
]

export default function App() {
	return (
		<html lang='en'>
			<head>
				<meta charSet='utf-8' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<Meta />
				<Links />
			</head>
			<body>
				<Header />
				<Outlet />
				<ScrollRestoration />
				<Scripts />
				<LiveReload />
			</body>
		</html>
	)
}
