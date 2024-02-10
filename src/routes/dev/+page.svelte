<script lang="ts">
	import Box from "$lib/canvas/box.svelte";
	import Canvas from "$lib/canvas/canvas.svelte";
	import type { Position } from "$lib/types";

  let size = { width: 50, height: 50 };

  let boxes = $state<(Position & { fill: string })[]>([
    { x: 10, y: 10, fill: 'red' },
    { x: 20, y: 20, fill: 'green' },
    { x: 30, y: 30, fill: 'blue' },
  ]);

  let toggle = () => {
    boxes.reverse();
  }

</script>

<div class="page">
  <div class="container">
    <Canvas>
      {#each boxes as box, i (i)}
        <Box position={box} {size} fill={box.fill} />
      {/each}
    </Canvas>
  </div>
  <div class="row">
    <button onclick={toggle}>Toggle</button>
  </div>
</div>

<style lang="scss">
  .page {
    flex: 1;
    padding: 15px;
    display: flex;
    flex-direction: column;
    gap: 15px;
    > .container {
      width: 800px;
      height: 400px;
      outline: 1px solid rgba(255,0,0,0.3);
    }
  }
</style>
