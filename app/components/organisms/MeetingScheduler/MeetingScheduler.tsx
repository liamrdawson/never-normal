import { DateTime, Interval } from 'luxon'
import type { SerializeFrom } from '@remix-run/node'
import type { AvailableSlotsForDay } from '~/utils/availability'
import { useEffect, useState } from 'react'
import { useFetcher } from '@remix-run/react'
import type { loader } from '~/routes/onboarding.$externalId'

export function MeetingScheduler({
	availableSlots,
	externalId,
}: {
	availableSlots: SerializeFrom<AvailableSlotsForDay>[]
	externalId: string
}) {
	const fetcher = useFetcher<typeof loader>()
	const fetchedData = fetcher.data
	const weekdays = fetchedData
		? fetchedData.availability.filter(
				(d) => DateTime.fromISO(d.day as string).weekday < 6
		  )
		: availableSlots.filter(
				(d) => DateTime.fromISO(d.day as string).weekday < 6
		  )

	const [selectedDay, setSelectedDay] = useState<
		SerializeFrom<AvailableSlotsForDay>
	>(weekdays[0])

	useEffect(() => {
		fetchedData && setSelectedDay(fetchedData.availability[0])
	}, [fetchedData])

	const rangeStart = DateTime.fromISO(
		weekdays[weekdays.length - 1].day as string
	)
		.startOf('day')
		.plus({ days: 1 })
		.toISO()

	const rangeEnd = DateTime.fromISO(rangeStart as string)
		.plus({ days: 6 })
		.toISO()

	const handleLaterClick = () => {
		// Get later dates
		fetcher.load(
			`/onboarding/${externalId}?start=${rangeStart}&end=${rangeEnd}`
		)
	}

	// const handleEarlierClick = () => {
	// 	// Get earler dates
	// }

	return (
		<div>
			<h3>When can we meet?</h3>
			<h4>{DateTime.fromISO(weekdays[0].day as string).monthLong}</h4>

			<button>Earlier</button>
			{weekdays.map((day) => (
				<button
					key={`${day.day}-${availableSlots.indexOf(day)}`}
					onClick={() => setSelectedDay(day)}
				>
					{DateTime.fromISO(day.day as string).toLocaleString({
						day: '2-digit',
					})}
				</button>
			))}
			<button onClick={() => handleLaterClick()}>Later</button>

			{selectedDay?.availableMeetingSlotIntervals.map((interval) => {
				return (
					<div key={interval}>
						<p>
							{Interval.fromISO(interval).toLocaleString({
								weekday: 'long',
								month: 'long',
								day: '2-digit',
							})}
						</p>
						<p>{Interval.fromISO(interval).start?.toFormat("HH':'mm")}</p>
					</div>
				)
			})}
		</div>
	)
}
