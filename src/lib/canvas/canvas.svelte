<script lang="ts">
	import type { Size } from "$lib/types";
	import { resize } from "$lib/use-resize.svelte";
	import type { Snippet } from "svelte";
	import { createCanvasContext } from "./context.svelte";

  let context = createCanvasContext();

  let { children } = $props<{
    children?: Snippet
  }>();

  let onResize = (size: Size) => {
    console.log(size);
  }

</script>

<canvas bind:this={context.canvas} class="canvas" use:resize={{ onResize }}>
  {#if children}
    {@render children()}
  {/if}
</canvas>

<style lang="scss">
  .canvas {
    background: transparent;
    width: 100%;
    height: 100%;
  }
</style>
