<script lang="ts">
  import Stage from '$components/canvas/stage.svelte';
  import Layer from '$components/canvas/layer.svelte';
  import type { Size } from '$lib/types/schema';
  import Render from './render.svelte';

  let {
    pixel,
    size,
    pixels,
    isEditing,
    onUpdate,
  }: {
    pixel: number;
    size: Size;
    isEditing: boolean;
    pixels: number[];
    onUpdate: (pixels: number[]) => void;
  } = $props();

  let stage = $derived.by(() => {
    return {
      width: size.width * pixel - 1,
      height: size.height * pixel - 1,
    };
  });
</script>

<Stage class="pixel-editor-stage" size={stage}>
  <Layer>
    <Render {pixel} {size} {pixels} {onUpdate} {isEditing} />
  </Layer>
</Stage>
