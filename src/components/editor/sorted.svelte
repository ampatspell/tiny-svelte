<script lang="ts" generics="T extends object">
  import type { OrderBy } from './models/sorted.svelte';
  import Segment from './segmented/segment.svelte';
  import Segmented from './segmented/segmented.svelte';

  let { width, model } = $props<{
    width?: number;
    model: OrderBy<T>;
  }>();
</script>

<div class="sorted">
  <Segmented {width}>
    {#if !model.initial}
      <Segment value="None" isSelected={!model.selected} onClick={() => model.onField(undefined)} />
    {/if}
    {#each model.fields as field}
      <Segment value={field.toString()} isSelected={field === model.selected} onClick={() => model.onField(field)} />
    {/each}
  </Segmented>

  <Segmented width={45}>
    {#each model.directions as direction}
      <Segment value={direction} isSelected={model.direction === direction} onClick={() => model.onDirection(direction)} />
    {/each}
  </Segmented>
</div>

<style lang="scss">
  .sorted {
    display: flex;
    flex-direction: row;
    gap: 5px;
  }
</style>
