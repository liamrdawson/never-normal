import { Prisma } from '@prisma/client'

type HandlePrismaErrorOptions = {
	operation: string
	error: any
}

/**
 * Handles Prisma-related errors and logs relevant information.
 *
 * @param {HandlePrismaErrorOptions} options - The options for handling Prisma errors.
 * @param {string} options.operation - The name of the operation that caused the error.
 * @param {any} options.error - The error object thrown by Prisma.
 * @throws {Error} Throws a more user-friendly error message.
 * @returns {never} This function always throws an error, and the return type is never reached.
 *
 * @example
 * // Example usage:
 * try {
 *   // Prisma operation that may throw an error
 * } catch (error) {
 *   handlePrismaError({ operation: 'post.create', error });
 * }
 */

export function handlePrismaError({
	operation,
	error,
}: HandlePrismaErrorOptions): never {
	console.error(`Prisma error in ${operation}:`, error)

	if (
		error instanceof Prisma.PrismaClientKnownRequestError &&
		error.code === 'P2002'
	) {
		console.error(
			'Unique constraint violation: A new item cannot be created with this data.'
		)
	}

	throw new Error(
		`Failed to perform database operation: prisma.${operation}(). ${error.message}.`
	)
}
