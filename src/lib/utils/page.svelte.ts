import { page } from '$app/stores';
import type { Page } from '@sveltejs/kit';

export const useCurrentRoute = () => {
	let current = $state<Page<Record<string, string>, string | null>>();
	$effect(() =>
		page.subscribe((page) => {
			current = page;
		})
	);
	return {
		get current() {
			return current;
		}
	};
};
