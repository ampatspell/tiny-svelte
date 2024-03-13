<script lang="ts">
  import type { Snippet } from 'svelte';
  import { getStageContext } from './contexts/stage.svelte';
  import { LayerContext, setLayerContext } from './contexts/layer.svelte';
  import { setRenderContext } from './contexts/render.svelte';

  let {
    children
  }: {
    name?: string;
    children?: Snippet;
  } = $props();

  let stage = getStageContext();
  let layer = new LayerContext({
    stage,
    model: () => null,
    draw: () => () => {}
  });
  setLayerContext(layer);
  setRenderContext(layer);
</script>

<div class="layer">
  <canvas class="canvas" bind:this={layer.element} />
  <div class="children" bind:this={layer.children}>
    {#if children}
      {@render children()}
    {/if}
  </div>
</div>

<style lang="scss">
  .layer {
    display: contents;
    > .canvas {
      background: transparent;
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
    }
    > .children {
      display: none;
    }
  }
</style>
