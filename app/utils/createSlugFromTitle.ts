export function createSlugFromTitle(title: string): string {
	validateMarkdownPostTitle(title)
	const slug = title.toLowerCase().split(' ').join('-')
	return slug
}

export function validateMarkdownPostTitle(title: string): void {
	if (title.trim().length === 0) {
		throw new Error('Invalid input: Title cannot be a string of only spaces.')
	}
	if (title.length < 5) {
		throw new Error(
			`Invalid input: "${title}" is too short. Title needs to be longer than 4 characters.`
		)
	}
	if (/^[^A-Za-z0-9]+$/.test(title)) {
		throw new Error(
			`Invalid input: "${title}" contains only special characters.`
		)
	}
}
