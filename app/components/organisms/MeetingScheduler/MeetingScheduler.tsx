import { DateTime } from 'luxon'
import type { SerializeFrom } from '@remix-run/node'
import type { AvailableSlotsForDay } from '~/utils/availability'

export function MeetingScheduler({
	availableSlots,
}: {
	availableSlots: SerializeFrom<AvailableSlotsForDay>[]
}) {
	return (
		<div>
			<h3>When can we meet?</h3>
			<ul>
				{availableSlots.map((day) => (
					<li key={`${day}-${availableSlots.indexOf(day)}`}>
						{DateTime.fromISO(day as unknown as string).toLocaleString({
							weekday: 'long',
							month: 'long',
							day: '2-digit',
						})}
					</li>
				))}
			</ul>
		</div>
	)
}
