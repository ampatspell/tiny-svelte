<script lang="ts">
	import type { BoxNodeModel } from '$lib/workspace/model.svelte';
	import Node from '$lib/workspace/node.svelte';
	import Box from './box.svelte';

	let { model, onClick } = $props<{
		model: BoxNodeModel;
		onClick: () => void;
	}>();
</script>

<Node {model} {onClick}>
	<Box size={model.size} color={model.color} />
</Node>
