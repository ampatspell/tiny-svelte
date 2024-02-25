<script lang="ts">
	import Edit from '$lib/editor/asset/edit.svelte';
	import { getLayout } from '$lib/editor/asset/layout.svelte';

	let { data } = $props();
	let asset = $derived(data.asset);

	let save = $state<() => Promise<void>>();

	getLayout().onEditing(async () => {
		await save?.();
	});
</script>

<div class="page">
	<Edit {asset} save={(arg) => (save = arg)} />
</div>

<style lang="scss">
	.page {
		padding: 15px;
		display: flex;
		flex-direction: column;
		gap: 5px;
	}
</style>
