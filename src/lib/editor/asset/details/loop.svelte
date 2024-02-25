<script lang="ts">
	import type { LoopAssetData } from '$lib/types';
	import type { CollectionDocument } from '$server/collection';

	let { asset } = $props<{
		asset: CollectionDocument<LoopAssetData>;
	}>();
</script>

<div class="pre">
	{JSON.stringify(asset, null, 2)}
</div>
