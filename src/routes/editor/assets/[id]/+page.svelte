<script lang="ts">
	import Details from '$lib/editor/asset/details.svelte';

	let { data } = $props();
	let asset = $derived(data.asset);
</script>

<div class="page">
	<Details {asset} />
</div>

<style lang="scss">
	.page {
		padding: 15px;
		display: flex;
		flex-direction: column;
		gap: 5px;
	}
</style>
