import { Interval, DateTime } from 'luxon'
import { getAvailableSlots } from '../calculateAvailability'

describe('getAvailabilitySlots', () => {
	it('takes an array of available Interval ranges into and returns an array of availabilitySlot Interval ranges', () => {
		const availablilityIntervals = [
			Interval.fromDateTimes(
				DateTime.fromISO('2023-12-12T11:15:00.000+00:00'),
				DateTime.fromISO('2023-12-12T12:00:00.000+00:00')
			),
			Interval.fromDateTimes(
				DateTime.fromISO('2023-12-12T12:30:00.000+00:00'),
				DateTime.fromISO('2023-12-12T13:00:00.000+00:00')
			),
		]

		const meetingSlots = [
			Interval.fromDateTimes(
				DateTime.fromISO('2023-12-12T11:15:00.000+00:00'),
				DateTime.fromISO('2023-12-12T11:45:00.000+00:00')
			),
			Interval.fromDateTimes(
				DateTime.fromISO('2023-12-12T12:30:00.000+00:00'),
				DateTime.fromISO('2023-12-12T13:00:00.000+00:00')
			),
		]

		const result = getAvailableSlots({
			meetingSlotDurationMinutes: 30,
			meetingSlotBufferMinutes: 15,
			availability: availablilityIntervals,
		})

		console.log(result)

		expect(result).toEqual(meetingSlots)
	})
})
