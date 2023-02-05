import { goto } from '$app/navigation';
import { get } from 'svelte/store';
import { page } from '$app/stores';

type GotoOptions = Parameters<typeof goto>[1];

const defaultGotoOptions: GotoOptions = { noScroll: false, keepFocus: false };

export async function set(
	key: string | string[],
	value: string | string[],
	goToOptions: GotoOptions = defaultGotoOptions
) {
	const $page = get(page);
	const query = new URLSearchParams($page.url.searchParams.toString());
	const queryStringOld = query.toString();
	if (Array.isArray(key) && Array.isArray(value)) {
		key.forEach((key, i) => {
			if (value[i]) {
				query.set(key, value[i]);
			} else {
				query.delete(key);
			}
		});
	} else if (typeof key === 'string' && typeof value === 'string') {
		if (value) {
			query.set(key, value);
		} else {
			query.delete(key);
		}
	}
	const queryString = query.toString();
	if (queryString === queryStringOld) return;
	return await goto(`?${queryString}`, goToOptions);
}

export async function remove(
	key: string | string[],
	goToOptions: GotoOptions = defaultGotoOptions
) {
	const $page = get(page);
	const query = new URLSearchParams($page.url.searchParams.toString());
	const queryStingOld = query.toString();
	if (Array.isArray(key)) {
		key.forEach((key) => query.delete(key));
	} else if (typeof key === 'string') {
		query.delete(key);
	}
	const querySting = query.toString();
	if (querySting === queryStingOld) return;
	if (querySting.length === 0) {
		await goto($page.url.pathname, goToOptions);
	} else {
		await goto(`?${querySting}`, goToOptions);
	}
}
