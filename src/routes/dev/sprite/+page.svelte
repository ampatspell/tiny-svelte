<script lang="ts">
  import Group from '$components/canvas/group.svelte';
  import Layer from '$components/canvas/layer.svelte';
  import Stage from '$components/canvas/stage.svelte';
  import SpriteEditor from '$components/sprite-editor.svelte';
  import type { Size } from '$lib/types/schema';

  let sprite = $state<{ pixels: number[]; size: Size }>({
    pixels: new Array(8 * 8).fill(0),
    size: { width: 8, height: 8 }
  });

  let data = $derived(sprite.pixels);
  let size = $derived(sprite.size);
  let pixel = $state(32);

  let onUpdated = (next: number[]) => {
    sprite.pixels = next;
  };

  let large = $derived.by(() => {
    return {
      width: size.width * pixel * 2,
      height: size.height * pixel + 1
    };
  });
</script>

<div class="page">
  <div class="stage">
    <Stage class="stage" size={large}>
      <Layer>
        <SpriteEditor {pixel} {size} {data} {onUpdated} />
        <Group position={{ x: size.width * pixel + 10, y: 10 }}>
          <SpriteEditor pixel={2} {size} {data} {onUpdated} />
        </Group>
      </Layer>
    </Stage>
  </div>
</div>

<style lang="scss">
  .page {
    padding: 15px;
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
</style>
