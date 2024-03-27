<script lang="ts">
  import Segment from '$components/basic/segmented/segment.svelte';
  import Segmented from '$components/basic/segmented/segmented.svelte';
  import Item from '../item.svelte';
  import type { HasMutablePixel } from '../types';

  let {
    omitTitle,
    model,
  }: {
    omitTitle?: boolean;
    model: HasMutablePixel;
  } = $props();

  let pixels = [1, 2, 4, 8, 16];

  let onSelect = (pixel: number) => {
    model.onPixel(pixel);
  };

  let title = $derived(!omitTitle ? 'Pixel' : undefined);
</script>

<Item {title}>
  <Segmented>
    {#each pixels as pixel}
      <Segment value="{pixel}px" isSelected={pixel === model.pixel} onClick={() => onSelect(pixel)} />
    {/each}
  </Segmented>
</Item>
