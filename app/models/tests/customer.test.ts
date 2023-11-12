/**
 * Uses the singleton client instance to call the mock implementation.
 */

import { createLead } from '../customer.server'
import { prismaMock } from 'prisma/singleton'

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
