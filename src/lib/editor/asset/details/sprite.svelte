<script lang="ts">
  import type { SpriteAssetData } from '$lib/types';
  import type { CollectionDocument } from '$server/collection';

  let { asset } = $props<{
    asset: CollectionDocument<SpriteAssetData>;
  }>();
</script>

<div class="pre">
  {JSON.stringify(asset.data.size, null, 2)}
</div>
