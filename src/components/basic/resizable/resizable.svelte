<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { ResizeCallback, VoidCallback } from '$lib/types/types';
  import type { Point, Size } from '$lib/types/schema';
  import Pins from './pins.svelte';
  import { classes } from '$lib/utils/classes';
  import type { Border } from './models.svelte';

  let {
    border,
    externalPixel,
    internalPixel,
    step,
    position,
    size,
    isResizable,
    onResize,
    onStart,
    onEnd,
    children
  }: {
    border: Border;
    externalPixel: number;
    internalPixel: number;
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

<div class={classes('resizable', `border-${border}`)}>
  <Pins {externalPixel} {internalPixel} {step} {position} {size} {onResize} {isResizable} {onStart} {onEnd} />
  <div class="content">
    {#if children}
      {@render children()}
    {/if}
  </div>
</div>

<style lang="scss">
  .resizable {
    border: 1px solid transparent;
    transition: 0.15s ease-in-out border-color;
    position: relative;
    :global(> .pins) {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
    }
    &.border-idle {
      border-color: fade-out(#000, 0.9);
    }
    &.border-focus {
      border-color: #00bbf9;
    }
    &.border-warning {
      border-color: #f15bb5;
    }
  }
</style>
