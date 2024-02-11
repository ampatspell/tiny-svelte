<script lang="ts">
	import type { Position, Size } from "$lib/types";
	import Render from "./render.svelte";

  let { position, size, fill } = $props<{
    position: Position;
    size: Size;
    fill: string;
  }>();

  let draw = ({ size, fill }: { size: Size, fill: string }, ctx: CanvasRenderingContext2D) => {
    console.log('draw', fill);
    ctx.fillStyle = fill;
    ctx.fillRect(0, 0, size.width, size.height);
  }

</script>

<Render name="box {fill}" position={position} model={{ size, fill }} {draw} />
