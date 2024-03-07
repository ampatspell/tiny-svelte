<script lang="ts">
  import { classes, type Classes } from '$lib/utils/classes';
  import type { Snippet } from 'svelte';
  import Pins from './pins.svelte';
  import type { OnResizeFn } from './model.svelte';
  import type { Point, Size } from '$lib/types';

  let {
    class: _class,
    pixel,
    step,
    position,
    size,
    isResizable,
    onResize,
    children
  } = $props<{
    class: Classes;
    pixel: number;
    step: number;
    position: Point;
    size: Size;
    isResizable: boolean;
    onResize: OnResizeFn;
    children?: Snippet;
  }>();
</script>

<div class={classes('resizable', _class)}>
  <Pins {pixel} {step} {position} {size} {onResize} {isResizable} />
  <div class="content">
    {#if children}
      {@render children()}
    {/if}
  </div>
</div>

<style lang="scss">
  .resizable {
    border: 1px solid lighten(#ef476f, 10%);
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
