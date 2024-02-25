<script lang="ts">
	import Button from '$lib/editor/button.svelte';
	import Placeholder from '$lib/editor/placeholder.svelte';
	import { useTRPC } from '$lib/trpc/client.svelte';

	const rpc = useTRPC();

	const create = async () => {
		await rpc.assets.create.query({
			type: 'sprite',
			identifier: 'first',
			size: {
				width: 8,
				height: 8
			},
			pixels: Array(8 * 8).fill(0)
		});
	};
</script>

<Placeholder label="Select asset on the right">
	<Button value="Add a new sprite" onClick={create} />
</Placeholder>
