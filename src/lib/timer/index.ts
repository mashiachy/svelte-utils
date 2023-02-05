import { readable, derived, type Readable } from 'svelte/store';

export function unixtimeToMs(unix: string | number) {
	let milliseconds = 0;
	if (typeof unix === 'string') {
		let seconds = Number.parseInt(unix);
		if (isNaN(seconds)) seconds = 0;
		milliseconds = seconds * 1000;
	} else if (typeof unix === 'number') {
		milliseconds = unix * 1000;
	}
	return milliseconds;
}

export function setupMsTimer(
	date: Date | string | number,
	currentDate: Date | string | number = new Date(),
	polling = 500
) {
	if (typeof date === 'string' || typeof date === 'number') {
		date = new Date(unixtimeToMs(date));
	}
	if (!date) {
		date = new Date();
	}

	if (typeof currentDate === 'string' || typeof currentDate === 'number') {
		currentDate = new Date(unixtimeToMs(currentDate));
	}
	if (!currentDate) {
		currentDate = new Date();
	}

	const initialCurrentTime = currentDate.getTime();
	const initialTime = new Date().getTime();
	const targetTimestamp = date.getTime();
	const getDelta = () =>
		Math.max(targetTimestamp - (initialCurrentTime + (new Date().getTime() - initialTime)), 0);
	return readable<number>(getDelta(), (set) => {
		let interval: NodeJS.Timer | null = setInterval(() => {
			const delta = getDelta();
			if (delta <= 0) {
				set(0);
				interval && clearInterval(interval);
				interval = null;
			} else {
				set(delta);
			}
		}, polling);
		return () => {
			if (interval) {
				clearInterval(interval);
				interval = null;
			}
		};
	});
}

export type TimerState = {
	time: number;
	s: number;
	m: number;
	h: number;
	d: number;
};

export function setupTimer(date: Date | string | number, currentDate?: Date | string | number) {
	const r = setupMsTimer(date, currentDate);
	return derived<Readable<number>, TimerState>(r, ($r) => {
		const s = ~~($r / 1000);
		const m = ~~($r / (1000 * 60));
		const h = ~~($r / (1000 * 60 * 60));
		const d = ~~($r / (1000 * 60 * 60 * 24));
		return {
			time: $r,
			s: s % 60,
			m: m % 60,
			h: h % 24,
			d
		};
	});
}
