import { DateTime, Interval } from 'luxon'
import { calculateAvailability } from '../calculateAvailability'
import type { CalendlyUserBusyTime } from '../calendlyAPI/getCalendlyUserBusyTimes.server'

describe('getAvailability', () => {
	it('Calculates availability based on schedule data and busy times', () => {
		const mockData = {
			day: DateTime.fromISO('2023-12-12T11:51:22.162+00:00'),
			scheduleInterval: { from: '11:00', to: '13:00' },
			busyTimes: [
				{
					end_time: '2023-12-12T11:15:00.000000Z',
					start_time: '2023-12-12T11:00:00.000000Z',
					type: 'external',
				},
				{
					end_time: '2023-12-12T12:30:00.000000Z',
					start_time: '2023-12-12T12:00:00.000000Z',
					type: 'external',
				},
			] as CalendlyUserBusyTime[],
		}

		const mockAvailableIntervals = [
			Interval.fromDateTimes(
				DateTime.fromISO('2023-12-12T11:15:00.000+00:00'),
				DateTime.fromISO('2023-12-12T12:00:00.000+00:00')
			),
			Interval.fromDateTimes(
				DateTime.fromISO('2023-12-12T12:30:00.000+00:00'),
				DateTime.fromISO('2023-12-12T13:00:00.000+00:00')
			),
		]

		const availability = calculateAvailability(mockData)

		expect(availability).toEqual(mockAvailableIntervals)
	})
})
