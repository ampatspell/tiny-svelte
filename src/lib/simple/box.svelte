<script lang="ts">
	import type { Position, Size } from '$lib/types';
	import Render from './render.svelte';

	let { position, size, fill } = $props<{
		position?: Position;
		size: Size;
		fill: string;
	}>();

	let draw = (ctx: CanvasRenderingContext2D) => {
		ctx.fillStyle = fill;
		ctx.fillRect(0, 0, size.width, size.height);
	};
</script>

<Render {position} model={{ size, fill }} {draw} />
