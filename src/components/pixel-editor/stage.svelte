<script lang="ts">
  import Stage from '$components/canvas/stage.svelte';
  import Layer from '$components/canvas/layer.svelte';
  import type { Size } from '$lib/types/schema';
  import Render from './render.svelte';
  import { multiplySize } from '$lib/utils/math';

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

  let stage = $derived(multiplySize(size, pixel));
</script>

<Stage class="pixel-editor-stage" size={stage}>
  <Layer>
    <Render {pixel} {size} {pixels} {onUpdate} {isEditing} />
  </Layer>
</Stage>
