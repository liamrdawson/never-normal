import prisma from '~/db.server'
import crypto from 'crypto'
import { handlePrismaError } from '~/utils/handlePrismaError'
import { validateContactForm } from '~/utils/contactForm'

export async function getContact({
	firstName,
	email,
}: {
	firstName: string
	email: string
}) {
	validateContactForm({ firstName, email })
	try {
		console.log(
			`Finding contact with firstName: ${firstName} and email ${email}.`
		)
		const foundContact = await prisma.contact.findFirst({
			where: {
				AND: [
					{ first_name: { equals: firstName } },
					{ email: { equals: email } },
				],
			},
		})
		console.log('contact found:', foundContact)
		return foundContact
	} catch (error) {
		await handlePrismaError({ operation: 'contact.findFirst', error })
		return error as never
	}
}

export async function createContact({
	firstName,
	email,
}: {
	firstName: string
	email: string
}) {
	validateContactForm({ firstName, email })
	const externalId = crypto.randomUUID()
	try {
		console.log(
			`Creating new contact with firstName: ${firstName} and email: ${email}.`
		)
		const newContact = await prisma.contact.create({
			data: {
				first_name: firstName,
				external_id: externalId,
				email,
			},
		})
		console.log(`New contact created: ${newContact}`)
		return newContact
	} catch (error) {
		await handlePrismaError({ operation: 'contact.create', error })
		return error as never
	}
}

export async function getOrCreateContact({
	firstName,
	email,
}: {
	firstName: string
	email: string
}) {
	const existingContact = await getContact({ firstName, email })
	if (existingContact) {
		console.log('Returning existing contact:', existingContact)
		return existingContact
	}

	const newContact = await createContact({
		firstName,
		email,
	})
	console.log('Returning newly created contact:', newContact)
	return newContact
}
