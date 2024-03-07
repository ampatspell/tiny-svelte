<script lang="ts">
  import type { AssetData, SpriteAssetData } from '$lib/types';
  import type { CollectionDocument } from '$server/collection';
  import Sprite from './edit/sprite.svelte';

  let { asset, save } = $props<{
    asset: CollectionDocument<AssetData>;
    save: (fn: () => Promise<void>) => void;
  }>();
</script>

{#if asset.data.type === 'sprite'}
  <Sprite asset={asset as CollectionDocument<SpriteAssetData>} {save} />
{:else if asset.data.type === 'loop'}
  TODO: loop
{/if}
