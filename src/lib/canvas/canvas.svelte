<script lang="ts">
	import type { Size } from "$lib/types";
	import { resize } from "$lib/use-resize.svelte";

  let onResize = (size: Size) => {
    console.log(size);
  }

</script>

<canvas class="canvas" use:resize={{ onResize }}/>

<style lang="scss">
  .canvas {
    background: rgba(255,0,0,0.1);
    width: 100%;
    height: 100%;
  }
</style>
