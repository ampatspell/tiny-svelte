<script lang="ts">
  import { classes, type Classes } from '$lib/utils/classes';
  import { draggable, DraggableAxis } from '$lib/utils/use-draggable.svelte';
  import { stepPoint } from '$lib/utils/math';
  import type { Point, Size } from '$lib/types/schema';
  import { Horizontal, Vertical, type VoidCallback } from '$lib/types/types';

  let {
    horizontal,
    vertical,
    pin,
    class: _class,
    externalPixel,
    internalPixel,
    step,
    position,
    size,
    isResizable,
    onResize,
    onStart: _onStart,
    onEnd: _onEnd,
  }: {
    class?: Classes;
    pin: number;
    horizontal: Horizontal;
    vertical: Vertical;
    externalPixel: number;
    internalPixel: number;
    position: Point;
    size: Size;
    step: number;
    isResizable: boolean;
    onStart: VoidCallback;
    onEnd: VoidCallback;
    onResize: (position: Point, size: Size) => void;
  } = $props();

  let pixel = $derived(externalPixel * internalPixel);

  let resizing = $state<{ position: Point; size: Size }>();

  let onPosition = (next: Point) => {
    const delta = stepPoint(next, step);

    let {
      position: { x, y },
      size: { width, height },
    } = resizing!;

    if (horizontal == Horizontal.Right) {
      width += delta.x;
    } else if (horizontal === Horizontal.Left) {
      x += internalPixel * delta.x;
      width -= delta.x;
    }

    if (vertical === Vertical.Top) {
      y += internalPixel * delta.y;
      height -= delta.y;
    } else if (vertical === Vertical.Bottom) {
      height += delta.y;
    }

    if (width < 0 || height < 0) {
      return;
    }

    onResize({ x, y }, { width, height });
  };

  const axis = $derived.by(() => {
    if (horizontal === Horizontal.Center) {
      return DraggableAxis.Vertical;
    } else if (vertical === Vertical.Center) {
      return DraggableAxis.Horizontal;
    } else {
      return DraggableAxis.Both;
    }
  });

  const onStart = () => {
    resizing = {
      position: { x: position.x, y: position.y },
      size: { width: size.width, height: size.height },
    };
    _onStart();
  };

  const onEnd = () => {
    resizing = undefined;
    _onEnd();
  };
</script>

<div
  class={classes(
    'pin',
    `horizontal-${horizontal}`,
    `vertical-${vertical}`,
    resizing && 'resizing',
    !isResizable && 'hidden',
    _class,
  )}
  style:--size="{pin}px"
  use:draggable={{
    isDraggable: isResizable,
    pixel,
    onPosition,
    onStart,
    onEnd,
    axis,
  }}
></div>

<style lang="scss">
  .pin {
    width: var(--size);
    height: var(--size);
    background: lighten(#f15bb5, 20%);
    border: 1px solid lighten(#f15bb5, 10%);
    transition:
      0.15s ease-in-out border-color,
      0.15s ease-in-out background-color;
    &:hover,
    &.resizing {
      border-color: lighten(#f15bb5, 0%);
      background: lighten(#f15bb5, 10%);
    }
    display: block;
    &.hidden {
      display: none;
    }
  }
</style>
