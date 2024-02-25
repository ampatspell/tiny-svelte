<script lang="ts">
	import Button from '$lib/editor/button.svelte';
	import { useTRPC } from '$lib/trpc/client.svelte.js';
	import { goto } from '$app/navigation';

	let { data } = $props();
	let asset = $derived(data.asset);
	let trpc = useTRPC();

	let destroy = async () => {
		await trpc.assets.delete.query({ id: data.asset.id });
		goto('/editor/assets');
	};
</script>

<div class="page">
	<div class="type">{asset.data.type}</div>
	<div class="identifier">{asset.data.identifier}</div>
	<div class="actions">
		<Button value="Delete" onClick={destroy} />
	</div>
</div>

<style lang="scss">
	.page {
		padding: 15px;
		display: flex;
		flex-direction: column;
		gap: 5px;
	}
</style>
