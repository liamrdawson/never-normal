import { LinksFunction } from '@remix-run/node'
import { Heading } from '~/components/atoms/Heading/Heading'
import styles from './serviceCard.css'

type ServiceCardProps = {
	title: string
	description: string
	image: string
}

export const links: LinksFunction = () => [
	{
		rel: 'stylesheet',
		href: styles,
	},
]

function ServiceCard({ title, description, image }: ServiceCardProps) {
	return (
		<div className='card'>
			<div className='image-container'>{image}</div>
			<Heading as='h3'>{title}</Heading>
			<p>{description}</p>
		</div>
	)
}

const services = [
	{
		title: 'Shopify Theme Development',
		description:
			'Custom builds, theme customizations, app integrations & backend configuration.',
		image: 'image src',
	},
	{
		title: 'Theme Customisation',
		description:
			'Strategy, app integrations, custom built, performant storefronts & backend configuration.',
		image: 'image src',
	},
	{
		title: 'Strategy & Planning',
		description:
			'Consulting on strategy, content, and scaling your eCommerce business.',
		image: 'image src',
	},
	{
		title: 'Website Auditing',
		description:
			'Strategy, app integrations, custom built, performant storefronts & backend configuration.',
		image: 'image src',
	},
	{
		title: 'Conversion Rate Optimisation',
		description:
			'Strategy, app integrations, custom built, performant storefronts & backend configuration.',
		image: 'image src',
	},
	{
		title: 'Store Setup & Migration',
		description:
			'Strategy, app integrations, custom built, performant storefronts & backend configuration.',
		image: 'image src',
	},
]

function ServicesSection() {
	return (
		<section className='services-section'>
			<strong className='services-callout'>
				Your website is the heart of your brand. I’m here to ensure you get the
				best results from each and every visitor. Here’s how I can supercharge
				your business and grow your sales.
			</strong>
			<Heading as='h2'>Our Services</Heading>
			<div className='grid'>
				{services.map((service) => (
					<ServiceCard
						key={service.title}
						title={service.title}
						description={service.description}
						image={service.image}
					/>
				))}
			</div>
		</section>
	)
}

export { ServicesSection }
