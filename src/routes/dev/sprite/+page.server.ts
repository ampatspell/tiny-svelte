import type { SpriteAssetData } from '$lib/types';
import type { CollectionDocument } from '$server/collection';
import type { ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async (event) => {
	const {
		locals: { server }
	} = event;

	for (let i = 0; i < 50; i++) {
		await server.collections.assets.set(`sprite-${i}`, {
			type: 'sprite',
			identifier: `sprite ${i}`,
			size: {
				width: 8,
				height: 8
			},
			pixels: Array(8 * 8).fill(0)
		});
	}

	await server.collections.assets.set('default', {
		type: 'sprite',
		identifier: 'default',
		size: {
			width: 8,
			height: 8
		},
		pixels: Array(8 * 8).fill(0)
	});

	const asset = await server.collections.assets.get('default');
	return {
		sprite: asset as CollectionDocument<SpriteAssetData>
	};
};
