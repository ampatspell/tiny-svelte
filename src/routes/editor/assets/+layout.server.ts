import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	const id = event.params.id;
	const assets = event.locals.server.collections.assets;

	const loadAsset = async () => {
		if (!id) {
			return;
		}
		try {
			return await event.locals.server.collections.assets.get(id);
		} catch (err: unknown) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			console.log('TODO: handle this error only', (err as any).stack);
			return redirect(307, '/editor/assets');
		}
	};

	return {
		assets: await assets.index(),
		asset: await loadAsset()
	};
};
