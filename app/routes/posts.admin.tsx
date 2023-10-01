import { json } from '@remix-run/node'
import { Link, useLoaderData, Outlet } from '@remix-run/react'

import { getPosts } from '~/models/post.server'

export const loader = async () => {
	return json({ posts: await getPosts() })
}

export default function PostAdmin() {
	const { posts } = useLoaderData<typeof loader>()
	return (
		<div>
			<h1>Blog Admin</h1>
			<div>
				<nav>
					<ul>
						{posts.map((post) => (
							<li key={post.slug}>
								<Link to={post.slug}>{post.title}</Link>
							</li>
						))}
					</ul>
				</nav>
				<main>
					<Outlet />
				</main>
			</div>
		</div>
	)
}
