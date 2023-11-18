import { Prisma } from '@prisma/client'

type HandlePrismaErrorOptions = {
	operation: string
	error: any
}

export function handlePrismaError({
	operation,
	error,
}: HandlePrismaErrorOptions): never {
	console.error(`Prisma error in ${operation}:`, error)

	if (
		error instanceof Prisma.PrismaClientKnownRequestError &&
		error.code === 'P2002'
	) {
		throw new Error(
			'Unique constraint violation: A new item cannot be created with this data.'
		)
	}

	throw new Error(
		`Failed to perform database operation: prisma.${operation}(). ${error.message}.`
	)
}
