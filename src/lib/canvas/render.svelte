<script lang="ts" generics="T">
	import { RenderContext, getRenderContext, setRenderContext, type DrawFunction } from "./models.svelte";

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
    draw: DrawFunction<T>,
    children?: Snippet
  }>();

  let parent = getRenderContext();
  let render = new RenderContext({
    layer: parent.layer,
    parent: parent,
    position: () => position,
    model: () => model,
    draw: () => draw,
  });
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
