<script lang="ts">
  import { resize } from '$lib/utils/use-resize.svelte';
  import type { Point, Size } from '$lib/types/schema';
  import type { StageContext } from '$components/canvas/contexts/stage.svelte';
  import Stage from '$components/canvas/stage.svelte';
  import Layer from '$components/canvas/layer.svelte';
  import Group from '$components/canvas/group.svelte';
  import Box from '$components/canvas/box.svelte';

  let size = { width: 50, height: 50 };

  let boxes = $state<(Point & { fill: string; enabled: boolean })[]>([
    { x: 0, y: 0, fill: 'red', enabled: true },
    { x: 10, y: 10, fill: 'green', enabled: true },
    { x: 20, y: 20, fill: 'blue', enabled: true }
  ]);

  let reverse = () => {
    boxes.reverse();
  };

  let move = () => {
    let mid = boxes[1];
    let end = boxes[2];
    boxes[2] = mid;
    boxes[1] = end;
  };

  let touch = () => {
    boxes[0].fill = boxes[0].fill === 'red' ? 'orange' : 'red';
  };

  let stage = $state<StageContext>();
  let onCreated = (context: StageContext) => (stage = context);
  let onResize = (size: Size) => (stage!.size = size);

  let showLayer = $state(true);
  let toggleShowLayer = () => (showLayer = !showLayer);

  let placement = $state<'top' | 'bottom'>('top');
  let togglePlacement = () => {
    placement = placement === 'top' ? 'bottom' : 'top';
    console.log(placement);
  };
</script>

<div class="page">
  <div class="container" use:resize={{ onResize }}>
    <Stage {onCreated}>
      {#if showLayer}
        <Layer>
          <Group position={{ x: 20, y: 20 }}>
            {#if placement === 'top'}
              <Box size={{ width: 200, height: 100 }} fill="orange" />
            {/if}

            {#each boxes as box (box)}
              <Box position={box} {size} fill={box.fill} />
            {/each}

            {#if placement === 'bottom'}
              <Box size={{ width: 200, height: 100 }} fill="orange" />
            {/if}
          </Group>
        </Layer>
      {/if}
    </Stage>
  </div>
  <div class="row">
    <button class="dark-button" onclick={toggleShowLayer}>Toggle show layer</button>
    <button class="dark-button" onclick={togglePlacement}>Toggle placement</button>
  </div>
  <div class="row">
    <button class="dark-button" onclick={reverse}>Reverse</button>
    <button class="dark-button" onclick={move}>Move</button>
    <button class="dark-button" onclick={touch}>Thing</button>
  </div>
  <div class="row">
    {#each boxes as box}
      <button onclick={() => (box.enabled = !box.enabled)}>[{box.fill} {box.enabled}]</button>&nbsp;
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
      outline: 1px solid rgba(255, 0, 0, 0.3);
    }
  }
</style>
