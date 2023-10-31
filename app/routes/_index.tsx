import type { LinksFunction, MetaFunction } from '@remix-run/node'
import { Link } from '@remix-run/react'
import { HeroSection } from '~/components/molecules/HeroSection/HeroSection'
import {
	ServicesSection,
	links as ServicesSectionLinks,
} from '~/components/molecules/ServiceCard/ServiceCard'

export const links: LinksFunction = () => [...ServicesSectionLinks()]

export const meta: MetaFunction = () => {
	return [
		{ title: 'New Remix App' },
		{ name: 'description', content: 'Welcome to Remix!' },
	]
}

export default function Index() {
	return (
		<main>
			<HeroSection />
			<ServicesSection />
			<div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.8' }}>
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
		</main>
	)
}
