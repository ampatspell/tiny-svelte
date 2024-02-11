<script lang="ts">
	import type { Position } from '$lib/types';
	import type { Snippet } from 'svelte';
	import Render from './render.svelte';

	let { position, children } = $props<{
		position?: Position;
		children?: Snippet;
	}>();

	let draw = () => {};
</script>

<Render name="group" {position} model={null} {draw}>
	{#if children}
		{@render children()}
	{/if}
</Render>
