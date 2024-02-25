<script lang="ts">
	import type { AssetData, LoopAssetData, SpriteAssetData } from '$lib/types';
	import type { CollectionDocument } from '$server/collection';
	import Sprite from './details/sprite.svelte';
	import Loop from './details/loop.svelte';

	let { asset } = $props<{
		asset: CollectionDocument<AssetData>;
	}>();
</script>

{#if asset.data.type === 'sprite'}
	<Sprite asset={asset as CollectionDocument<SpriteAssetData>} />
{:else if asset.data.type === 'loop'}
	<Loop asset={asset as CollectionDocument<LoopAssetData>} />
{/if}
