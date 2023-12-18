import { DateTime, Interval } from 'luxon'
import type { LinksFunction, SerializeFrom } from '@remix-run/node'
import type { AvailableSlotsForDay } from '~/utils/availability'
import { useEffect, useState } from 'react'
import { Form, useFetcher } from '@remix-run/react'
import type { loader } from '~/routes/onboarding.$externalId'
import styles from './meeting-scheduler.css'

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: styles }]

export function MeetingScheduler({
	availableSlots,
	externalId,
	email,
	name,
}: {
	availableSlots: SerializeFrom<AvailableSlotsForDay>[]
	externalId: string
	email: string
	name: string
}) {
	const fetcher = useFetcher<typeof loader>()
	const isFetching = fetcher.state !== 'idle'

	const fetchedData = fetcher.data?.availability
	const days = fetchedData ? fetchedData : availableSlots

	const weekdays = days.filter(
		(d) => DateTime.fromISO(d.day as string).weekday < 6
	)

	const [selectedDay, setSelectedDay] = useState<
		SerializeFrom<AvailableSlotsForDay>
	>(weekdays[0])
	const [selectedSlot, setSelectedSlot] = useState<string>()

	useEffect(() => {
		setSelectedDay(weekdays[0])
	}, [fetchedData])

	const handleLaterClick = () => {
		const rangeStart = DateTime.fromISO(days[days.length - 1].day as string)
			.startOf('day')
			.plus({ days: 1 })
			.toISO()

		const rangeEnd = DateTime.fromISO(rangeStart as string)
			.plus({ days: 6 })
			.toISO()

		const url = `/onboarding/${externalId}?start=${rangeStart}&end=${rangeEnd}`

		fetcher.load(url)
	}

	const handleEarlierClick = () => {
		const rangeStart = DateTime.fromISO(days[0].day as string)
			.startOf('day')
			.minus({ days: 7 })
			.toISO()

		const rangeEnd = DateTime.fromISO(rangeStart as string)
			.plus({ days: 6 })
			.toISO()

		const url = `/onboarding/${externalId}?start=${rangeStart}&end=${rangeEnd}`

		fetcher.load(url)
	}

	const handleSelectDay = (day: SerializeFrom<AvailableSlotsForDay>) => {
		if (selectedDay !== day) {
			setSelectedSlot(undefined)
		}
		setSelectedDay(day)
	}

	const attendee = {
		email,
		displayName: name,
		responseStatus: 'accepted',
	}

	const meetingStart = selectedSlot
		? Interval.fromISO(selectedSlot).start?.toISO()
		: undefined
	const meetingEnd = selectedSlot
		? Interval.fromISO(selectedSlot).end?.toISO()
		: undefined

	return (
		<div>
			<h3>When can we meet?</h3>
			<Form method='post' action={`/onboarding/${externalId}`}>
				<h4>{DateTime.fromISO(weekdays[0].day as string).monthLong}</h4>

				<button type='button' onClick={() => handleEarlierClick()}>
					Earlier
				</button>
				{isFetching ? (
					<strong>Getting new dates...</strong>
				) : (
					weekdays.map((day) => (
						<button
							disabled={day.availableMeetingSlotIntervals.length ? false : true}
							type='button'
							key={`${day.day}-${availableSlots.indexOf(day)}`}
							onClick={() => handleSelectDay(day)}
							className={selectedDay === day ? 'selected' : ''}
						>
							{DateTime.fromISO(day.day as string).toLocaleString({
								day: '2-digit',
							})}
						</button>
					))
				)}
				<button onClick={() => handleLaterClick()}>Later</button>

				{selectedDay?.availableMeetingSlotIntervals.map((interval) => {
					return (
						<div key={interval}>
							<button
								type='button'
								onClick={() => setSelectedSlot(interval)}
								className={selectedSlot === interval ? 'selected' : ''}
							>
								<p>
									{Interval.fromISO(interval).toLocaleString({
										weekday: 'long',
										month: 'long',
										day: '2-digit',
									})}
								</p>
								<p>{`${Interval.fromISO(interval).start?.toFormat(
									"HH':'mm"
								)} - ${Interval.fromISO(interval).end?.toFormat(
									"HH':'mm"
								)}`}</p>
							</button>
						</div>
					)
				})}

				<input
					hidden
					name='attendees'
					value={[JSON.stringify(attendee)]}
					readOnly
				/>
				<input hidden name='startTime' value={meetingStart} readOnly />
				<input hidden name='endTime' value={meetingEnd} readOnly />

				<button type='submit'>Submit</button>
			</Form>
		</div>
	)
}
