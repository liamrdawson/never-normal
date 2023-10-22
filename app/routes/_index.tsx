import type { MetaFunction } from '@remix-run/node'
import { Link } from '@remix-run/react'
import { Header } from '~/components/molecules/Header/Header'

export const meta: MetaFunction = () => {
	return [
		{ title: 'New Remix App' },
		{ name: 'description', content: 'Welcome to Remix!' },
	]
}

export default function Index() {
	return (
		<div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.8' }}>
			<Header
				headerCopy={
					'I design, build, and optimise unforgettable  online experiences that convert'
				}
			/>
			<ul>
				<li>
					<a
						target='_blank'
						href='https://remix.run/tutorials/blog'
						rel='noreferrer'
					>
						15m Quickstart Blog Tutorial
					</a>
				</li>
				<li>
					<a
						target='_blank'
						href='https://remix.run/tutorials/jokes'
						rel='noreferrer'
					>
						Deep Dive Jokes App Tutorial
					</a>
				</li>
				<li>
					<a target='_blank' href='https://remix.run/docs' rel='noreferrer'>
						Remix Docs
					</a>
				</li>
			</ul>
			<div>
				<Link to='/posts'>Blog Posts</Link>
			</div>
		</div>
	)
}
