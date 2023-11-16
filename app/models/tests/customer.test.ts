import { createLead, getLead, getOrCreateLead } from '../customer.server'
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

		await expect(createLead(newLead)).resolves.toEqual(resolvedLead)
	})
	it('should throw an error if an invalid email address is provided', async () => {
		const invalidLead = {
			firstName: 'Balin',
			email: 'Son of Fundin',
		}

		await expect(createLead(invalidLead)).rejects.toThrowError(
			'Invalid input: Son of Fundin is not a valid email.'
		)
	})
	it('should throw an error if lead already exists', async () => {
		const existingLead = {
			firstName: 'Oin',
			email: 'oin@thorinandcompany.com',
		}

		prismaMock.lead.create.mockRejectedValue({
			code: 'P2002',
			message: 'Unique constraint failed.',
		})

		await expect(createLead(existingLead)).rejects.toThrowError(
			'Failed to perform database operation: prisma.lead.create(). Unique constraint failed.'
		)
	})
})

describe('getOrCreateLead', () => {
	it('should return an existing lead if a match is found with the given name and email', async () => {
		const existingLead = {
			firstName: 'Gloin',
			email: 'gloin@thorinandcompany.com',
		}

		const foundLead = {
			id: 1,
			...existingLead,
		}

		prismaMock.lead.findFirst.mockResolvedValue(foundLead)
		const result = getOrCreateLead(existingLead)
		expect(result).resolves.toEqual(foundLead)
		expect(prismaMock.lead.findFirst).toHaveBeenCalledWith({
			where: {
				AND: [
					{ firstName: { equals: 'Gloin' } },
					{ email: { equals: 'gloin@thorinandcompany.com' } },
				],
			},
		})
		expect(prismaMock.lead.create).not.toHaveBeenCalled()
	})
	it('should return a newly created lead if no match is found with the fiven name and email', async () => {
		const newLead = {
			firstName: 'Fili',
			email: 'fili@thorinandcompany.com',
		}
		const newlyCreatedLead = {
			id: 1,
			...newLead,
		}

		prismaMock.lead.findFirst.mockResolvedValue(null)
		prismaMock.lead.create.mockResolvedValue(newlyCreatedLead)

		const result = getOrCreateLead(newLead)
		expect(result).resolves.toEqual(newlyCreatedLead)
	})
})
