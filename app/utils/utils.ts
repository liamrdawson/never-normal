/**
 * Creates a slug from a given title.
 *
 * @param {string} title - The title from which to create the slug.
 * @returns {string} The generated slug.
 */
export function createSlugFromTitle(title: string): string {
	const slug = title.toLowerCase().split(' ').join('-')
	return slug
}
