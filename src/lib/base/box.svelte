<script lang="ts">
	import type { Position, Size } from '$lib/types';
	import type { Snippet } from 'svelte';
	import Render from './render.svelte';

	let { position, size, fill, children } = $props<{
		position: Position;
		size: Size;
		fill: string;
		children?: Snippet;
	}>();

	let draw = ({ size, fill }: { size: Size; fill: string }, ctx: CanvasRenderingContext2D) => {
		ctx.fillStyle = fill;
		ctx.fillRect(0, 0, size.width, size.height);
	};
</script>

<Render name="box" {position} model={{ size, fill }} {draw}>
	{#if children}
		{@render children()}
	{/if}
</Render>
