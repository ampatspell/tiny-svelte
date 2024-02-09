<script lang="ts">
	import type { Position, Size } from "$lib/types";
	import { getCanvasContext } from "./context.svelte";

  let { position, size, fill } = $props<{
    position: Position;
    size: Size;
    fill: string;
  }>();

  let context = getCanvasContext();

  $effect(() => {
    console.log('box', position, size, fill);
    let ctx = context.canvas?.getContext('2d');
    if(ctx) {
      ctx.save();
      {
        ctx.fillStyle = fill;
        ctx.fillRect(position.x, position.y, size.width, size.height);
      }
      ctx.restore();
    }
  });
</script>
