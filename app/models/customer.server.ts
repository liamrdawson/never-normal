import type { Lead } from '@prisma/client'
import prisma from '~/db.server'
import { handlePrismaError } from '~/utils/handlePrismaError'
import { validateLeadForm } from '~/utils/leadForm'

export async function getLead(lead: Omit<Lead, 'id'>): Promise<Lead | null> {
	validateLeadForm(lead)
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
		await handlePrismaError({ operation: 'lead.findFirst', error })
		return error as never
	}
}

export async function createLead(lead: Omit<Lead, 'id'>): Promise<Lead> {
	validateLeadForm(lead)

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
		await handlePrismaError({ operation: 'lead.create', error })
		return error as never
	}
}

export async function getOrCreateLead(lead: Omit<Lead, 'id'>): Promise<Lead> {
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
