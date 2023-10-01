import type { ActionFunctionArgs } from '@remix-run/node'
import { redirect, json } from '@remix-run/node'
import { Form, useActionData, useNavigation } from '@remix-run/react'
import invariant from 'tiny-invariant'

import { createPost } from '~/models/post.server'

export const action = async ({ request }: ActionFunctionArgs) => {
	// TODO: remove me
	await new Promise((res) => setTimeout(res, 1000))

	const formData = await request.formData()

	const title = formData.get('title')
	const slug = formData.get('slug')
	const markdown = formData.get('markdown')

	const errors = {
		title: title ? null : 'Title is required',
		slug: slug ? null : 'Slug is required',
		markdown: markdown ? null : 'Markdown is required',
	}
	const hasErrors = Object.values(errors).some((errorMessage) => errorMessage)
	if (hasErrors) {
		return json(errors)
	}

	invariant(typeof title === 'string', 'title must be a string')
	invariant(typeof slug === 'string', 'slug must be a string')
	invariant(typeof markdown === 'string', 'markdown must be a string')

	await createPost({ title, slug, markdown })

	return redirect('/posts/admin')
}

export default function NewPost() {
	const errors = useActionData<typeof action>()
	console.log(errors)

	const navigation = useNavigation()
	const isCreating = Boolean(navigation.state === 'submitting')

	return (
		<Form method='post'>
			<p>
				<label>
					Post Title:
					{errors?.title ? <em>{errors.title}</em> : null}
					<input type='text' name='title' />
				</label>
			</p>
			<p>
				<label>
					Post Slug:
					{errors?.slug ? <em>{errors.slug}</em> : null}
					<input type='text' name='slug' />
				</label>
			</p>
			<p>
				<label htmlFor='markdown'>Markdown: </label>
				<br />
				{errors?.markdown ? <em>{errors.markdown}</em> : null}
				<textarea id='markdown' rows={20} name='markdown' />
			</p>
			<p className='text-right'>
				<button disabled={isCreating} type='submit'>
					{isCreating ? 'Creating...' : 'Create Post'}
				</button>
			</p>
		</Form>
	)
}
