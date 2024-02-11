<script lang="ts">
	import Layer from "$lib/canvas/layer.svelte";
	import type { StageContext } from "$lib/canvas/models.svelte";
	import Stage from "$lib/canvas/stage.svelte";
	import type { Size } from "$lib/types";
	import { resize } from "$lib/use-resize.svelte";
	import Box from "$lib/canvas/box.svelte";
	import type { Position } from "$lib/types";

  let size = { width: 50, height: 50 };

  let boxes = $state<(Position & { fill: string, enabled: boolean })[]>([
    { x: 10, y: 10, fill: 'red', enabled: true },
    { x: 20, y: 20, fill: 'green', enabled: true },
    { x: 30, y: 30, fill: 'blue', enabled: true },
  ]);

  let reverse = () => {
    boxes.reverse();
  }

  let move = () => {
    let mid = boxes[1];
    let end = boxes[2];
    boxes[2] = mid;
    boxes[1] = end;
  }

  let touch = () => {
    boxes[0].fill = boxes[0].fill === 'red' ? 'orange' : 'red';
  }

  let stage = $state<StageContext>();
  let onStage = (context: StageContext) => stage = context;
  let onResize = (size: Size) => stage!.size = size;

</script>

<div class="page">
  <div class="container" use:resize={{ onResize }}>
    <Stage {onStage}>
      <Layer>
        {#each boxes as box}
          {#if box.enabled}
            <Box position={box} {size} fill={box.fill} />
          {/if}
        {/each}
      </Layer>
    </Stage>
  </div>
  <div class="row">
    <button class="dark-button" onclick={reverse}>Reverse</button>
    <button class="dark-button" onclick={move}>Move</button>
    <button class="dark-button" onclick={touch}>Thing</button>
  </div>
  <div class="row">
    {#each boxes as box}
      <button onclick={() => box.enabled = !box.enabled}>[{box.fill} {box.enabled}]</button>&nbsp;
    {/each}
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
      flex: 1;
      outline: 1px solid rgba(255,0,0,0.3);
    }
  }
</style>
