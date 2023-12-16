import { DateTime, Interval } from 'luxon'
import type { LinksFunction, SerializeFrom } from '@remix-run/node'
import type { AvailableSlotsForDay } from '~/utils/availability'
import { useEffect, useState } from 'react'
import { useFetcher } from '@remix-run/react'
import type { loader } from '~/routes/onboarding.$externalId'
import styles from './meeting-scheduler.css'

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: styles }]

export function MeetingScheduler({
	availableSlots,
	externalId,
}: {
	availableSlots: SerializeFrom<AvailableSlotsForDay>[]
	externalId: string
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

	return (
		<div>
			<h3>When can we meet?</h3>
			<h4>{DateTime.fromISO(weekdays[0].day as string).monthLong}</h4>

			<button onClick={() => handleEarlierClick()}>Earlier</button>
			{isFetching ? (
				<strong>Getting new dates...</strong>
			) : (
				weekdays.map((day) => (
					<button
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
							<p>{Interval.fromISO(interval).start?.toFormat("HH':'mm")}</p>
						</button>
					</div>
				)
			})}
			<button>Submit</button>
		</div>
	)
}
