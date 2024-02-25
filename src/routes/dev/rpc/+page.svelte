<script lang="ts">
	import { createTrpc } fromcreateTrpctrpc/client.svelte';
	import Button from '$lib/editor/button.svelte';

	let rpc = createTrpc();

	let greeting = $state();
createTrpcoad = async () => {
		greeting = await rpc.assets.query({ name: 'hello' });
	};
</script>

<div class="page">
	<div class="row">RPC</div>
	<div class="row">
		<Button value="Load" onClick={load} />
	</div>
	<div class="row json">{JSON.stringify(greeting, null, 2)}</div>
</div>

<style lang="scss">
	.page {
		padding: 15px;
		display: flex;
		flex-direction: column;
		gap: 5px;
		> .row {
			&.json {
				white-space: nowrap;
			}
		}
	}
</style>
