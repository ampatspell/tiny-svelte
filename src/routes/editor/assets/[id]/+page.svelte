<script lang="ts">
	import Button from '$lib/editor/button.svelte';
	import { invalidateAll } from '$app/navigation';

	let { data } = $props();
	let asset = $derived(data.asset!);

	let destroy = async () => {
		await fetch(`/api/assets/${asset.id}`, { method: 'DELETE' });
		invalidateAll();
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
	}
</style>
