<script lang="ts">
  import type { Point, Size } from '$lib/types';
  import { Horizontal, Vertical, type OnResizeFn } from './model.svelte';
  import Pin from './pin.svelte';

  let { pixel, step, position, size, isResizable, onResize, onStart, onEnd } = $props<{
    pixel: number;
    step: number;
    position: Point;
    size: Size;
    isResizable: boolean;
    onResize: OnResizeFn;
    onStart: () => void;
    onEnd: () => void;
  }>();

  let pin = (horizontal: Horizontal, vertical: Vertical) => ({
    horizontal,
    vertical,
    onResize: (position: Point, size: Size) => {
      onResize({
        horizontal,
        vertical,
        position,
        size
      });
    }
  });

  let pins = [
    ...[Horizontal.Left, Horizontal.Center, Horizontal.Right].map((horizontal) => {
      return pin(horizontal, Vertical.Top);
    }),
    ...[Horizontal.Left, Horizontal.Right].map((horizontal) => {
      return pin(horizontal, Vertical.Center);
    }),
    ...[Horizontal.Left, Horizontal.Center, Horizontal.Right].map((horizontal) => {
      return pin(horizontal, Vertical.Bottom);
    })
  ];

  let pinSize = $state(9);
  let offset = $derived(Math.ceil(pinSize / 2));
</script>

<div class="pins" class:resizable={isResizable} style:--offset="{offset}px">
  {#each pins as pin}
    <Pin
      class="pin"
      pin={pinSize}
      vertical={pin.vertical}
      horizontal={pin.horizontal}
      {position}
      {size}
      {isResizable}
      onResize={pin.onResize}
      {onStart}
      {onEnd}
      {pixel}
      {step}
    />
  {/each}
</div>

<style lang="scss">
  .pins {
    --o: calc(0px - var(--offset));

    :global(> .pin) {
      position: absolute;
      z-index: 1;
    }

    :global(> .pin.vertical-top) {
      top: var(--o);
    }

    :global(> .pin.vertical-bottom) {
      bottom: var(--o);
    }

    :global(> .pin.vertical-center) {
      top: calc(50% + var(--o));
    }

    :global(> .pin.horizontal-left) {
      left: var(--o);
    }

    :global(> .pin.horizontal-center) {
      right: calc(50% + var(--o));
    }

    :global(> .pin.horizontal-right) {
      right: var(--o);
    }

    display: none;
    &.resizable {
      display: block;
    }
  }
</style>
