<script lang="ts">
  import Layer from '$lib/base/layer.svelte';
  import Stage from '$lib/base/stage.svelte';
  import SpriteEditor from '$lib/sprite/sprite-editor.svelte';
  import { createTRPC } from '$lib/trpc/client.svelte';
  import type { SpriteAssetData } from '$lib/types';
  import type { CollectionDocument } from '$server/collection';

  let { assign } = Object;

  let { asset, save } = $props<{
    asset: CollectionDocument<SpriteAssetData>;
    save: (fn: () => Promise<void>) => void;
  }>();

  let trpc = createTRPC();

  save(async () => {
    await trpc.assets.update.query({
      id: asset.id,
      data: assign({}, asset.data, { pixels })
    });
  });

  let pixels = $state([...asset.data.pixels]);
  let size = $derived(asset.data.size);
  let pixel = $state(32);

  let onUpdated = (next: number[]) => {
    pixels = next;
  };

  let large = $derived.by(() => {
    return {
      width: size.width * pixel * 2,
      height: size.height * pixel + 1
    };
  });
</script>

<div class="block">
  <Stage class="stage" size={large}>
    <Layer>
      <SpriteEditor {pixel} {size} data={pixels} {onUpdated} />
    </Layer>
  </Stage>
</div>
