<script lang="ts">
  import type { Point, Size } from '$lib/types/schema';
  import Render from './render.svelte';

  let { position, size, fill } = $props<{
    position?: Point;
    size: Size;
    fill: string;
  }>();

  let draw = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = fill;
    ctx.fillRect(0, 0, size.width, size.height);
  };
</script>

<Render name="box {size.width}x{size.height}, {fill}" {position} model={{ size, fill }} {draw} />
