<script lang="ts">
  import Button from '$components/basic/button.svelte';
  import type { WorkspaceModel } from '$lib/models/project/workspace/workspace.svelte';
  import type { AssetType } from '$lib/types/assets';
  import Item from '../item.svelte';

  let { model }: { model: WorkspaceModel } = $props();

  // TODO: AsyncButton
  let isBusy = $state(false);

  let onCreate = async (type?: AssetType) => {
    try {
      isBusy = true;
      await model.nodes.createNewAsset(type);
    } finally {
      isBusy = false;
    }
  };

  let onBox = () => onCreate('box');
  let onSprite = () => onCreate('sprite');
  let onBlank = () => onCreate();
</script>

<Item title="Add new">
  <div class="content">
    <Button value="Box" isDisabled={isBusy} onClick={onBox} />
    <Button value="Sprite" isDisabled={isBusy} onClick={onSprite} />
    <Button value="Blank" isDisabled={isBusy} onClick={onBlank} />
  </div>
</Item>

<style lang="scss">
  .content {
    width: 100%;
    display: grid;
    grid-auto-columns: minmax(var(--segment-width), 1fr);
    grid-auto-flow: column;
    gap: 5px;
  }
</style>
