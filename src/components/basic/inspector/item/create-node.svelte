<script lang="ts">
  import Dropdown from '$components/basic/dropdown/dropdown.svelte';
  import type { WorkspaceModel } from '$lib/models/project/workspace/workspace.svelte';
  import type { AssetType } from '$lib/types/assets';
  import type { VoidCallback } from '$lib/types/types';
  import Item from '../item.svelte';

  let { model }: { model: WorkspaceModel } = $props();

  let onCreate = async (type?: AssetType) => {
    await model.nodes.createNewAsset(type);
  };

  type Type = { name: string; onClick: VoidCallback };

  let types = [
    { name: 'Box', onClick: () => onCreate('box') },
    { name: 'Sprite', onClick: () => onCreate('sprite') },
    { name: 'Scene', onClick: () => onCreate('scene') },
    { name: 'Scene layer', onClick: () => onCreate('scene-layer') },
    { name: 'Blank', onClick: () => onCreate() },
  ];

  let onSelect = (type?: Type) => {
    if (type) {
      type.onClick();
    }
  };
</script>

<Item>
  <Dropdown items={types} {onSelect}>
    {#snippet placeholder()}
      Add new asset
    {/snippet}
    {#snippet item(model)}
      {model.name}
    {/snippet}
  </Dropdown>
</Item>

<style lang="scss">
  .content {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
</style>
