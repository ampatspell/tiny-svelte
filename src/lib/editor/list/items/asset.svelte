<script lang="ts">
  import type { AssetIndex } from '$lib/types';
  import type { CollectionIndexDocument } from '$server/collection';
  import type { ItemProps } from '../model.ts';
  import Item from '../item.svelte';

  let { isSelected, route, asset } = $props<
    {
      asset: CollectionIndexDocument<AssetIndex>;
    } & ItemProps
  >();
</script>

<Item {isSelected} {route}>
  <div class="asset">
    <div class="type">{asset.data.type}</div>
    <div class="identifier">{asset.data.identifier}</div>
  </div>
</Item>

<style lang="scss">
  .asset {
    display: flex;
    flex-direction: column;
    gap: 5px;
    > .identifier {
      font-weight: bold;
    }
  }
</style>
