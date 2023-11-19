import {
	createContact,
	getContact,
	getOrCreateContact,
} from '../contact.server'
import { prismaMock } from 'prisma/singleton'
import { faker } from '@faker-js/faker'
import type { Contact } from '@prisma/client'

describe('getContact', () => {
	it('should return a contact if one is found matching the given firstName and email', async () => {
		const contact = {
			firstName: 'Dwalin',
			email: 'dwalin@thorinandcompany.com',
		}
		const foundContact = {
			first_name: 'Dwalin',
			email: 'dwalin@thorinandcompany.com',
			internal_contact_id: faker.number.int(),
			external_id: faker.string.uuid(),
			last_name: null,
			updatedAt: faker.date.recent(),
			createdAt: faker.date.past(),
		}

		prismaMock.contact.findFirst.mockResolvedValue(foundContact)

		expect(getContact(contact)).resolves.toEqual(foundContact)
	})
	it('should return null if no contact is found matching the given firstName and email', async () => {
		const nonExistentContact = {
			firstName: 'Liam',
			email: 'liam@nonexistent.com',
		}

		prismaMock.contact.findFirst.mockResolvedValue(null)

		expect(getContact(nonExistentContact)).resolves.toEqual(null)
	})
	it('should throw an error if an invalid email address is provided', async () => {
		const invalidContact = {
			firstName: 'Balin',
			email: 'Son of Fundin',
		}

		expect(getContact(invalidContact)).rejects.toThrowError(
			'Invalid input: Son of Fundin is not a valid email.'
		)
	})
})

describe('createContact', () => {
	it('should create a new contact', async () => {
		const newContact = {
			firstName: 'Joe',
			email: 'joe@example.com',
		}
		const resolvedContact = {
			first_name: 'Joe',
			last_name: null,
			internal_contact_id: faker.number.int(),
			external_id: faker.string.uuid(),
			email: 'joe@example.com',
			createdAt: new Date(),
			updatedAt: new Date(),
		}

		prismaMock.contact.create.mockResolvedValue(resolvedContact)

		await expect(createContact(newContact)).resolves.toEqual(resolvedContact)
	})
	it('should throw an error if an invalid email address is provided', async () => {
		const invalidContact = {
			firstName: 'Balin',
			email: 'Son of Fundin',
		}

		await expect(createContact(invalidContact)).rejects.toThrowError(
			'Invalid input: Son of Fundin is not a valid email.'
		)
	})
	it('should throw an error if contact already exists', async () => {
		const existingContact = {
			firstName: 'Oin',
			email: 'oin@thorinandcompany.com',
		}

		prismaMock.contact.create.mockRejectedValue({
			code: 'P2002',
			message: 'Unique constraint failed.',
		})

		await expect(createContact(existingContact)).rejects.toThrowError(
			'Failed to perform database operation: prisma.contact.create(). Unique constraint failed.'
		)
	})
})

describe('getOrCreateContact', () => {
	it('should return an existing contact if a match is found with the given name and email', async () => {
		const existingContact = {
			firstName: 'Gloin',
			email: 'gloin@thorinandcompany.com',
		}

		const foundContact: Contact = {
			...existingContact,
			internal_contact_id: faker.number.int(),
			external_id: faker.string.uuid(),
			first_name: 'Gloin',
			email: 'gloin@thorinandcompany.com',
			last_name: null,
			createdAt: faker.date.past(),
			updatedAt: faker.date.recent(),
		}

		prismaMock.contact.findFirst.mockResolvedValue(foundContact)
		const result = getOrCreateContact(existingContact)
		expect(result).resolves.toEqual(foundContact)
		expect(prismaMock.contact.findFirst).toHaveBeenCalledWith({
			where: {
				AND: [
					{ first_name: { equals: 'Gloin' } },
					{ email: { equals: 'gloin@thorinandcompany.com' } },
				],
			},
		})
		expect(prismaMock.contact.create).not.toHaveBeenCalled()
	})
	it('should return a newly created contact if no match is found with the fiven name and email', async () => {
		const newContact = {
			firstName: 'Fili',
			email: 'fili@thorinandcompany.com',
		}
		const newlyCreatedContact: Contact = {
			internal_contact_id: faker.number.int(),
			external_id: faker.string.uuid(),
			first_name: 'Fili',
			last_name: null,
			email: 'fili@thorinandcompany.com',
			createdAt: new Date(),
			updatedAt: new Date(),
		}

		prismaMock.contact.findFirst.mockResolvedValue(null)
		prismaMock.contact.create.mockResolvedValue(newlyCreatedContact)

		const result = getOrCreateContact(newContact)
		expect(result).resolves.toEqual(newlyCreatedContact)
	})
})
