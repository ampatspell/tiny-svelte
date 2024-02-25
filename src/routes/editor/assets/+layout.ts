import { createTRPC } from '$lib/trpc/client.svelte';
import type { AssetIndexDocument } from '$lib/types';
import type { LayoutLoad } from './$types';

const { assign } = Object;

class AssetsRouteModel {
	all!: (AssetIndexDocument & { isSelected: boolean })[];
	selectedId?: string;

	constructor(selectedId?: string) {
		this.selectedId = selectedId;
	}

	async load() {
		const { index } = await createTRPC().assets.index.query();
		const { selectedId: id } = this;
		this.all = index.map((doc) => {
			return assign({}, doc, {
				isSelected: doc.id === id
			});
		});
	}
}

export const load: LayoutLoad = async (event) => {
	const {
		params: { id }
	} = event;

	const assets = new AssetsRouteModel(id);
	await assets.load();

	return {
		assets
	};
};
