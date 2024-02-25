import type { LayoutLoad } from './$types';

export const load: LayoutLoad = (event) => {
	const { asset } = event.data;
	return {
		asset
	};
};
