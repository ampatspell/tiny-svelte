<script lang="ts">
	import type { Point } from '$lib/types';
	import type { Snippet } from 'svelte';
	import Render from './render.svelte';

	let { position, children } = $props<{
		position?: Point;
		children?: Snippet;
	}>();

	let draw = () => {};
</script>

<Render name="group" {position} model={null} {draw}>
	{#if children}
		{@render children()}
	{/if}
</Render>
