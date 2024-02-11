<script lang="ts" generics="T">
	import { RenderContext, getRenderContext, setRenderContext, type RenderContextDrawFunction } from "./models.svelte";

	import type { Position } from "$lib/types";
	import type { Snippet } from "svelte";

  let {
    name,
    position,
    model,
    draw,
    children
  } = $props<{
    name?: string,
    position: Position,
    model: T,
    draw: RenderContextDrawFunction<T>,
    children?: Snippet
  }>();

  let parent = getRenderContext();
  let render = $state<RenderContext>(new RenderContext({
    layer: parent.layer,
    parent: parent,
    position: () => position,
    draw: {
      model: () => model,
      draw: () => draw
    }
  }));
  parent.registerRender(render);
  setRenderContext(render);

  $effect.pre(() => {
    return () => {
      parent.unregisterRender(render!);
    }
  });

</script>

<div class={["render", name].filter(Boolean).join(' ')} bind:this={render.element}>
  {#if children}
    {@render children()}
  {/if}
</div>
