import { createTRPC } from '$lib/trpc/client.svelte';
import type { AssetIndexDocument } from '$lib/types';
import type { LayoutLoad } from './$types';

const { assign } = Object;

class Index {
	all: (AssetIndexDocument & { isSelected: boolean })[];

	constructor(data: AssetIndexDocument[], selectedId?: string) {
		this.all = data.map((doc) => assign({}, doc, { isSelected: doc.id === selectedId }));
	}
}

export const load: LayoutLoad = async ({ params: { id } }) => {
	const { index } = await createTRPC().assets.index.query();
	return {
		index: new Index(index, id)
	};
};
