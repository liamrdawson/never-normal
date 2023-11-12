/**
 * Uses the singleton client instance to call the mock implementation.
 */

import { createLead, getLead } from '../customer.server'
import { prismaMock } from 'prisma/singleton'

describe('getLead', () => {
	it('should return a lead if one is found matching the given firstName and email', async () => {
		const lead = {
			firstName: 'Dwalin',
			email: 'dwalin@thorinandcompany.com',
		}
		const foundLead = {
			id: 1,
			...lead,
		}

		prismaMock.lead.findFirst.mockResolvedValue(foundLead)

		expect(getLead(lead)).resolves.toEqual(foundLead)
	})
	it('should return null if no lead is found matching the given firstName and email', async () => {
		const nonExistentLead = {
			firstName: 'Liam',
			email: 'liam@nonexistent.com',
		}

		prismaMock.lead.findFirst.mockResolvedValue(null)

		expect(getLead(nonExistentLead)).resolves.toEqual(null)
	})
	it('should throw an error if an invalid email address is provided', async () => {
		const invalidLead = {
			firstName: 'Balin',
			email: 'Son of Fundin',
		}

		expect(getLead(invalidLead)).rejects.toThrowError(
			'Invalid input: Son of Fundin is not a valid email.'
		)
	})
})

describe('createLead', () => {
	it('should create a new lead', async () => {
		const newLead = {
			firstName: 'Joe',
			email: 'joe@example.com',
		}
		const resolvedLead = {
			id: 1,
			...newLead,
		}

		prismaMock.lead.create.mockResolvedValue(resolvedLead)

		expect(createLead(newLead)).resolves.toEqual(resolvedLead)
	})
})
