<script lang="ts">
	import type { Snippet } from "svelte";
	import { LayerContext, getStageContext, setLayerContext, setRenderContext } from "./models.svelte";
	import { objectToStyle, sizeToStyleObject } from "./style.svelte";

  let {
    children
  } = $props<{
    children?: Snippet
  }>();

  let stage = getStageContext();
  let layer = new LayerContext(stage);
  stage.registerLayer(layer);
  setLayerContext(layer);
  setRenderContext(layer.render);

  $effect.pre(() => {
    return () => {
      stage.unregisterLayer(layer!);
    };
  });

  $effect.pre(() => {
    if(layer) {
      const { canvas, size } = layer;
      if(canvas) {
        canvas.width = size.width;
        canvas.height = size.height;
      }
    }
  });

  let style = $derived(objectToStyle(sizeToStyleObject(layer!.size)));
</script>

<canvas bind:this={layer!.render.element} {style} class="layer">
  {#if children}
    {@render children()}
  {/if}
</canvas>

<style lang="scss">
  .layer {
    position: absolute;
    background: transparent;
  }
</style>
