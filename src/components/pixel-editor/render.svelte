<script lang="ts">
  import type { RenderContext } from '$components/canvas/contexts/render.svelte';
  import Render from '$components/canvas/render.svelte';
  import type { Point, Size } from '$lib/types/schema';
  import { drawGrid } from '$lib/utils/canvas';
  import { fromIndex, toIndex } from '$lib/utils/pixel';

  let {
    position,
    pixel,
    size,
    pixels,
    isEditing,
    onUpdate,
  }: {
    position?: Point;
    pixel: number;
    size: Size;
    pixels: number[];
    isEditing: boolean;
    onUpdate: (data: number[]) => void;
  } = $props();

  type Model = {
    pixel: number;
    size: Size;
    hover?: Point;
    pixels: number[];
  };

  let render = $state<RenderContext>();
  let hover = $state<Point>();
  let drawing = $state<{ color: number }>();

  $effect(() => {
    if (!isEditing) {
      hover = undefined;
      drawing = undefined;
    }
  });

  let model = $derived<Model>({ pixel, size, hover, pixels });

  let draw = (ctx: CanvasRenderingContext2D) => {
    let drawPixel = (position: Point, fillStyle: string) => {
      ctx.fillStyle = fillStyle;
      ctx.fillRect(position.x * pixel, position.y * pixel, pixel, pixel);
    };

    for (let i = 0; i < size.width * size.height; i++) {
      let value = pixels[i];
      let position = fromIndex(i, size);
      let fillStyle = value === 0 ? '#fff' : '#333';
      drawPixel(position, fillStyle);
    }

    if (pixel > 8) {
      drawGrid({ ctx, pixel, size });
    }

    if (hover) {
      drawPixel(hover, 'rgba(255,0,0,0.05)');
    }
  };

  let toPixel = (e: MouseEvent) => {
    let point = render!.eventToRenderPosition(e);
    let px = Math.floor(point.x / pixel);
    let py = Math.floor(point.y / pixel);
    if (px >= 0 && px < size.width && py >= 0 && py < size.height) {
      return { x: px, y: py };
    }
  };

  let update = (pixel: Point) => {
    let index = toIndex(pixel, size);
    let next = [...pixels];
    next[index] = drawing!.color;
    onUpdate(next);
  };

  let onmousedown = (e: MouseEvent) => {
    if (!isEditing) {
      return;
    }
    if (e.button !== 0) {
      return;
    }
    let pixel = toPixel(e);
    if (pixel) {
      let color = pixels[toIndex(pixel, size)] === 0 ? 1 : 0;
      drawing = { color };
      update(pixel);
    }
  };

  let onmousemove = (e: MouseEvent) => {
    if (!isEditing) {
      return;
    }
    let pixel = toPixel(e);
    hover = pixel;
    if (pixel && drawing) {
      update(pixel);
    }
  };

  let onmouseup = () => {
    drawing = undefined;
  };
</script>

<svelte:window on:mousemove={onmousemove} on:mousedown={onmousedown} on:mouseup={onmouseup} />

<Render name="pixel-editor-render" onCreated={(ctx) => (render = ctx)} {position} {model} {draw} />
