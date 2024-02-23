<script lang="ts">
	let { data } = $props();
	let asset = $derived(data.asset!);
</script>

<div class="page">
	<div class="type">{asset.data.type}</div>
	<div class="identifier">{asset.data.identifier}</div>
</div>

<style lang="scss">
	.page {
		padding: 15px;
	}
</style>
