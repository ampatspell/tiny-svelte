<script lang="ts">
  import Button from '$components/basic/button.svelte';
  import Inspector from '$components/basic/inspector/inspector.svelte';
  import Item from '$components/basic/inspector/item.svelte';
  import type { WorkspaceAssetModel } from '$lib/models/project/workspace/asset.svelte';
  import Project from '../project/project.svelte';

  let {
    asset,
  }: {
    asset: WorkspaceAssetModel;
  } = $props();

  let model = $derived(asset.asset);

  let isAdding = $state(false);
  let onAdd = async () => {
    isAdding = true;
    try {
      await asset.assets.workspace.nodes.createNewNode(model);
    } finally {
      isAdding = false;
    }
  };
</script>

<Inspector>
  <Project {model} />
  <Item>
    <Button value="Add to workspace" disabled={isAdding} onClick={onAdd} />
  </Item>
</Inspector>
