import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { handlePrismaError } from '../handlePrismaError'

describe('handlePrismaError', () => {
	it('should log the prisma error and throw a generic error', () => {
		const operation = 'someOperation'
		const prismaError = new Error('Test error')

		const consoleErrorSpy = jest.spyOn(console, 'error')
		consoleErrorSpy.mockImplementation(() => {})

		expect(() =>
			handlePrismaError({ operation, error: prismaError })
		).toThrowError(
			`Failed to perform database operation: prisma.${operation}(). ${prismaError.message}.`
		)

		expect(consoleErrorSpy).toHaveBeenCalledWith(
			`Prisma error in ${operation}:`,
			prismaError
		)

		consoleErrorSpy.mockRestore()
	})

	it('should handle Prisma.PrismaClientKnownRequestError with code P2002', () => {
		const operation = 'someOperation'
		const error = new PrismaClientKnownRequestError('Test error', {
			code: 'P2002',
			clientVersion: '5.4.1',
		})

		const consoleErrorSpy = jest.spyOn(console, 'error')
		consoleErrorSpy.mockImplementation(() => {})

		expect(() => handlePrismaError({ operation, error })).toThrowError(
			'Unique constraint violation: A new item cannot be created with this data.'
		)

		expect(consoleErrorSpy).toHaveBeenCalledWith(
			`Prisma error in ${operation}:`,
			error
		)

		consoleErrorSpy.mockRestore()
	})
})
