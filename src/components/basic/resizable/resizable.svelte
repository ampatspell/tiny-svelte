<script lang="ts">
  import { classes, type Classes } from '$lib/utils/classes';
  import type { Snippet } from 'svelte';
  import type { ResizeCallback, VoidCallback } from '$lib/types/types';
  import type { Point, Size } from '$lib/types/schema';
  import Pins from './pins.svelte';

  let {
    class: _class,
    pixel,
    step,
    position,
    size,
    isResizable,
    onResize,
    onStart,
    onEnd,
    children
  }: {
    class?: Classes;
    pixel: number;
    step: number;
    position: Point;
    size: Size;
    isResizable: boolean;
    onResize: ResizeCallback;
    onStart: VoidCallback;
    onEnd: VoidCallback;
    children?: Snippet;
  } = $props();
</script>

<div class={classes('resizable', _class)}>
  <Pins {pixel} {step} {position} {size} {onResize} {isResizable} {onStart} {onEnd} />
  <div class="content">
    {#if children}
      {@render children()}
    {/if}
  </div>
</div>

<style lang="scss">
  .resizable {
    border: 1px solid #e63946;
    transition: 0.15s ease-in-out border-color;
    position: relative;
    :global(> .pins) {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
    }
  }
</style>