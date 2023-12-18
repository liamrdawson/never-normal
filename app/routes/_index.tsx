import type {
	ActionFunctionArgs,
	LinksFunction,
	MetaFunction,
} from '@remix-run/node'
import { Link, useActionData } from '@remix-run/react'
import { HeroSection } from '~/components/molecules/HeroSection/HeroSection'
import {
	ServicesSection,
	links as ServicesSectionLinks,
} from '~/components/molecules/ServiceCard/ServiceCard'
import {
	EmailForm,
	links as EmailFormLinks,
} from '~/components/organisms/EmailForm/EmailForm'
import { getOrCreateContact } from '~/models/contact.server'

export async function action({ request }: ActionFunctionArgs) {
	const formData = await request.formData()

	const name = formData.get('first-name')
	const email = formData.get('email')

	if (name && email) {
		const contact = {
			firstName: name.toString(),
			email: email.toString(),
		}
		return await getOrCreateContact(contact)
	}

	return { name, email }
}

export const links: LinksFunction = () => [
	...ServicesSectionLinks(),
	...EmailFormLinks(),
]

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
			<EmailForm
				inputData={[
					{
						type: 'text',
						label: 'First Name',
					},
					{
						type: 'email',
						label: 'Email',
					},
				]}
				formTitle={'Reserve Your Consultation'}
				formDescription={
					'Fill in the form below, you’ll get an email within 30 seconds with instructions on how to get started.'
				}
			/>
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
