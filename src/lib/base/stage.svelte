<script lang="ts">
  import { type Snippet } from 'svelte';
  import { classes, type Classes } from '$lib/utils/classes';
  import type { Size } from '$lib/types';
  import { StageContext, setStageContext } from './contexts/stage.svelte';
  import { objectToStyle, sizeToStyleObject } from '$lib/utils/style.svelte';

  let {
    class: className,
    size,
    onCreated,
    children
  } = $props<{
    class?: Classes;
    size?: Size;
    onCreated?: (stage: StageContext) => void;
    children?: Snippet;
  }>();

  let stage = new StageContext();
  setStageContext(stage);
  onCreated?.(stage);

  $effect(() => {
    stage.size = size;
  });

  let style = $derived.by(() => {
    let size = stage.size;
    if (size) {
      return objectToStyle(sizeToStyleObject(size));
    }
  });
</script>

<div class={classes('stage', className)} {style}>
  {#if children}
    {@render children()}
  {/if}
</div>

<style lang="scss">
  .stage {
    background: #fff;
    position: relative;
  }
</style>
