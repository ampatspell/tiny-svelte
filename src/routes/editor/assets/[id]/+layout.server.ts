import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ params, locals }) => {
	return {
		asset: await locals.server.collections.assets.get(params.id)
	};
};
