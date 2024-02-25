<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/editor/button.svelte';
	import Placeholder from '$lib/editor/placeholder.svelte';
	import { useTRPC } from '$lib/trpc/client.svelte';

	const trpc = useTRPC();

	const create = async () => {
		let res = await trpc.assets.create.query({
			type: 'sprite',
			identifier: 'hello',
			size: {
				width: 8,
				height: 8
			},
			pixels: new Array(8 * 8).fill(0)
		});
		goto(`/editor/assets/${res.id}`);
	};
</script>

<Placeholder label="Select asset on the right">
	<Button value="Add a new sprite" onClick={create} />
</Placeholder>
