<script lang="ts">
  import Stage from '$components/canvas/stage.svelte';
  import Layer from '$components/canvas/layer.svelte';
  import type { Size } from '$lib/types/schema';
  import Render from './render.svelte';

  let sprite = $state<{ pixels: number[]; size: Size }>({
    pixels: new Array(8 * 8).fill(0),
    size: { width: 8, height: 8 }
  });

  let data = $derived(sprite.pixels);
  let size = $derived(sprite.size);
  let pixel = $state(32);

  let onUpdated = (next: number[]) => {
    sprite.pixels = next;
  };

  let stageSize = $derived.by(() => {
    return {
      width: size.width * pixel - 1,
      height: size.height * pixel - 1
    };
  });
</script>

<Stage class="pixel-editor" size={stageSize}>
  <Layer>
    <Render {pixel} {size} {data} {onUpdated} />
  </Layer>
</Stage>
