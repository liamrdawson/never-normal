/**
 * The singleton file tells Jest to mock a default export
 * (the Prisma Client instance in ./client.ts), and uses the
 * mockDeep method from jest-mock-extended to enable access
 * to the objects and methods available on Prisma Client.
 * It then resets the mocked instance before each test is run.
 */

import type { PrismaClient } from '@prisma/client'
import type { DeepMockProxy } from 'jest-mock-extended'
import { mockDeep, mockReset } from 'jest-mock-extended'

import prisma from '~/db.server'

jest.mock('~/db.server', () => ({
	__esModule: true,
	default: mockDeep<PrismaClient>(),
}))

beforeEach(() => {
	mockReset(prismaMock)
})

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>
