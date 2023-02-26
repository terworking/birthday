import { utcToZonedTime } from 'date-fns-tz';
import { derived, writable } from 'svelte/store';
import type { State } from './types';

export const state = writable<State>({
	disableInteraction: false,
	selectedKey: '',
	selectedTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
});

let timer: NodeJS.Timer | undefined = undefined;
export const time = derived(
	state,
	($state, set) => {
		const updateTime = () => {
			set(utcToZonedTime(new Date(), $state.selectedTimeZone));
		};

		// reset the timer whenever state is updated
		updateTime();
		clearInterval(timer);
		timer = setInterval(updateTime, 1000);

		return () => {
			clearInterval(timer);
		};
	},
	new Date(),
);
