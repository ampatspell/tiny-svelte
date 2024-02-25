import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ params, locals }) => {
	const id = params.id;
	return {
		index: await locals.server.collections.assets.index(),
		id
	};
};
