import prisma from '~/db.server'

async function seed() {
	const authors = [
		{
			id: 100,
			firstName: 'Liam',
			lastName: 'Dawson',
			email: 'Liam.Dawson@NeverNormalCommerce.com',
		},
	]

	const posts = [
		{
			id: 1,
			likeCount: 0,
			slug: 'my-first-blog-post',
			authorId: 100,
			title: 'My First Post',
			markdown: `
  # This is my first post
  
  Isn't it great?
      `.trim(),
		},
		{
			id: 2,
			likeCount: 3,
			slug: '90s-mixtapes',
			authorId: 100,
			title: 'A Mixtape I Made Just For You',
			markdown: `
  # 90s Mixtape
  
  - I wish (Skee-Lo)
  - This Is How We Do It (Montell Jordan)
  - Everlong (Foo Fighters)
  - Ms. Jackson (Outkast)
  - Interstate Love Song (Stone Temple Pilots)
  - Killing Me Softly With His Song (Fugees, Ms. Lauryn Hill)
  - Just a Friend (Biz Markie)
  - The Man Who Sold The World (Nirvana)
  - Semi-Charmed Life (Third Eye Blind)
  - ...Baby One More Time (Britney Spears)
  - Better Man (Pearl Jam)
  - It's All Coming Back to Me Now (Céline Dion)
  - This Kiss (Faith Hill)
  - Fly Away (Lenny Kravits)
  - Scar Tissue (Red Hot Chili Peppers)
  - Santa Monica (Everclear)
  - C'mon N' Ride it (Quad City DJ's)
      `.trim(),
		},
	]

	for (const author of authors) {
		await prisma.author.upsert({
			where: { id: author.id },
			update: {},
			create: author,
		})
	}

	for (const post of posts) {
		await prisma.post.upsert({
			where: { slug: post.slug },
			update: {},
			create: post,
		})
	}

	console.log(`Database has been seeded. 🌱`)
}

seed()
	.catch((e) => {
		console.error(e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
