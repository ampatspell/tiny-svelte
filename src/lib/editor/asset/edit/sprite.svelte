<script lang="ts">
	import Layer from '$lib/base/layer.svelte';
	import Stage from '$lib/base/stage.svelte';
	import SpriteEditor from '$lib/sprite/sprite-editor.svelte';
	import { useTRPC } from '$lib/trpc/client.svelte';
	import type { SpriteAssetData } from '$lib/types';
	import type { CollectionDocument } from '$server/collection';

	let { asset, save } = $props<{
		asset: CollectionDocument<SpriteAssetData>;
		save: (fn: () => Promise<void>) => void;
	}>();

	let trpc = useTRPC();

	save(async () => {
		await trpc.assets.update.query(asset);
	});

	let data = $derived(asset.data.pixels);
	let size = $derived(asset.data.size);
	let pixel = $state(32);

	let onUpdated = (next: number[]) => {
		asset.data.pixels = next;
	};

	let large = $derived.by(() => {
		return {
			width: size.width * pixel * 2,
			height: size.height * pixel + 1
		};
	});
</script>

<div class="block">
	<Stage class="stage" size={large}>
		<Layer>
			<SpriteEditor {pixel} {size} {data} {onUpdated} />
		</Layer>
	</Stage>
</div>
