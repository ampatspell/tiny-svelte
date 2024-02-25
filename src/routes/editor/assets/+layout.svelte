<script lang="ts">
	import Asset from '$lib/editor/list/items/asset.svelte';
	import List from '$lib/editor/list/list.svelte';

	let { data } = $props();
</script>

<div class="layout">
	<div class="list">
		<List route="/editor/assets">
			{#each data.index as asset (asset)}
				<Asset {asset} route="/editor/assets/{asset.id}" isSelected={asset.id === data.id} />
			{/each}
		</List>
	</div>
	<div class="content">
		<slot />
	</div>
</div>

<style lang="scss">
	.layout {
		flex: 1;
		display: flex;
		flex-direction: row;
		> .list {
			width: 250px;
			border-right: 1px solid fade-out(#000, 0.9);
		}
		> .content {
			flex: 1;
			display: flex;
			flex-direction: column;
		}
	}
</style>
