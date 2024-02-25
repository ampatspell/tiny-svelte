import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	return {
		asset: await locals.server.collections.assets.get(params.id)
	};
};
