<script lang="ts">
  import Item from '$components/basic/inspector/item.svelte';
  import AssetIdentity from '$components/basic/inspector/item/asset-identity.svelte';
  import Identifier from '$components/basic/inspector/item/identifier.svelte';
  import Section from '$components/basic/inspector/section.svelte';
  import Delete from '$components/basic/inspector/item/delete.svelte';
  import type { ProjectAssetModel } from '$lib/models/project/asset.svelte';
  import Box from './box.svelte';
  import Sprite from './sprite.svelte';

  let {
    model,
  }: {
    model: ProjectAssetModel;
  } = $props();
</script>

<Section>
  <AssetIdentity {model} />
  <Identifier {model} />
  {#if model.type === 'box'}
    <Box {model} />
  {:else if model.type === 'sprite'}
    <Sprite {model} />
  {:else}
    <Item title="Asset">
      {model}
    </Item>
  {/if}
  <Delete {model} label="Delete asset" />
</Section>
