import type { Lead } from '@prisma/client'
import { Prisma } from '@prisma/client'
import prisma from '~/db.server'
import { validateLeadInput } from '~/utils/utils'

type HandlePrismaError = {
	error: any
	operation: 'create' | 'find' | 'findFirst'
}

export async function handlePrismaError({
	operation,
	error,
}: HandlePrismaError): Promise<never> {
	console.error(`Prisma error: ${operation}`, error)

	if (
		error instanceof Prisma.PrismaClientKnownRequestError &&
		error.code === 'P2002'
	) {
		console.error(
			'Unique constraint violation: A new lead cannot be created with this email.'
		)
	}

	throw new Error(
		`Failed to perform database operation: prisma.lead.${operation}(). ${error.message}`
	)
}

export async function getLead(lead: Omit<Lead, 'id'>): Promise<Lead | null> {
	validateLeadInput(lead)
	try {
		const { firstName, email } = lead
		console.log(`Finding lead with firstName: ${firstName} and email ${email}.`)
		const foundLead = await prisma.lead.findFirst({
			where: {
				AND: [
					{ firstName: { equals: firstName } },
					{ email: { equals: email } },
				],
			},
		})
		console.log('lead found:', foundLead)
		return foundLead
	} catch (error) {
		await handlePrismaError({ operation: 'findFirst', error })
		return error as never
	}
}

export async function createLead(lead: Omit<Lead, 'id'>): Promise<Lead> {
	validateLeadInput(lead)

	try {
		const { firstName, email } = lead
		console.log(
			`Creating new lead with firstName: ${firstName} and email: ${email}.`
		)
		const newLead = await prisma.lead.create({
			data: {
				firstName,
				email,
			},
		})
		console.log(`New lead created: ${newLead}`)
		return newLead
	} catch (error) {
		await handlePrismaError({ operation: 'create', error })
		return error as never
	}
}

export async function getOrCreateLead(lead: Omit<Lead, 'id'>): Promise<Lead> {
	validateLeadInput(lead)

	const { firstName, email } = lead
	const existingLead = await getLead({ firstName, email })
	if (existingLead) {
		console.log('Returning existing lead:', existingLead)
		return existingLead
	}

	const newLead = await createLead({ firstName, email })
	console.log('Returning newly created lead:', newLead)
	return newLead
}
