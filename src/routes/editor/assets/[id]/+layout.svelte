<script lang="ts">
	import { goto } from '$app/navigation';
	import { createLayout } from '$lib/editor/asset/layout.svelte.js';
	import Button from '$lib/editor/button.svelte';
	import { useTRPC } from '$lib/trpc/client.svelte';

	let { data } = $props();
	let asset = $derived(data.asset);

	let trpc = useTRPC();

	let destroy = async () => {
		await trpc.assets.delete.query({ id: data.asset.id });
		goto('/editor/assets');
	};

	let layout = createLayout();

	let save = async () => {
		await layout.save?.();
		goto(`/editor/assets/${asset.id}`);
	};
</script>

<div class="layout">
	<div class="header">
		<div class="item identifier">{asset.data.identifier}</div>
		<div class="item type">{asset.data.type}</div>
		<div class="item id">{asset.id}</div>
		<div class="item actions">
			{#if layout.isEditing}
				<Button value="Save" onClick={save} />
				<Button value="Cancel" route="/editor/assets/{asset.id}" />
			{:else}
				<Button value="Edit" route="/editor/assets/{asset.id}/edit" />
				<Button value="Delete" onClick={destroy} />
			{/if}
		</div>
	</div>
	<div class="content">
		<slot />
	</div>
</div>

<style lang="scss">
	.layout {
		flex: 1;
		display: flex;
		flex-direction: column;
		> .header {
			padding: 5px 15px;
			border-bottom: 1px solid fade-out(#000, 0.9);
			display: flex;
			flex-direction: row;
			gap: 15px;
			align-items: center;
			> .item {
				&.identifier {
					font-weight: bold;
				}
				&.actions {
					flex: 1;
					display: flex;
					flex-direction: row;
					justify-content: flex-end;
					gap: 5px;
				}
			}
		}
		> .content {
			flex: 1;
			display: flex;
			flex-direction: column;
		}
	}
</style>
