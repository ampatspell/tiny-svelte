import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	return {
		assets: await event.locals.server.collections.assets.index()
	};
};
