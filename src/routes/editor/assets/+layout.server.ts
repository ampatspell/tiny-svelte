import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	const id = event.params.id;
	const assets = event.locals.server.collections.assets;

	const loadAsset = async () => {
		if (!id) {
			return;
		}
		return event.locals.server.collections.assets.get(id);
	};

	return {
		assets: await assets.index(),
		asset: await loadAsset()
	};
};
