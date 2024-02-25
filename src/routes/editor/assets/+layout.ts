import { createTRPC } from '$lib/trpc/client.svelte';
import type { LayoutLoad } from './$types';
import { AssetsRouteModel } from './model.svelte';

export const load: LayoutLoad = async ({ params: { id } }) => {
	const { index } = await createTRPC().assets.index.query();
	return {
		assets: new AssetsRouteModel(index, id)
	};
};
