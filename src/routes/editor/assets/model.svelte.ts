import type { AssetIndexDocument } from '$lib/types';

const { assign } = Object;

export class AssetsRouteModel {
	all: (AssetIndexDocument & { isSelected: boolean })[];

	constructor(data: AssetIndexDocument[], selectedId?: string) {
		this.all = data.map((doc) => {
			return assign({}, doc, {
				isSelected: doc.id === selectedId
			});
		});
	}
}
