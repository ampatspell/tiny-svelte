<script lang="ts">
  import Stage from '$components/pixel-editor/stage.svelte';
  import type { ProjectSpriteAssetModel } from '$lib/models/project/asset.svelte';
  import type { WorkspaceNodeModel } from '$lib/models/project/workspace/node.svelte';
  import { getWorkspaceContext } from './base/model.svelte';

  let {
    node,
  }: {
    node: WorkspaceNodeModel;
  } = $props();

  let workspace = getWorkspaceContext();
  let asset = $derived(node.asset as ProjectSpriteAssetModel);

  let pixel = $derived(workspace.pixel * node.pixel);
  let size = $derived(asset.size);
  let pixels = $derived(asset.pixels);

  let onUpdate = (next: number[]) => {
    asset.onPixels(next);
  };

  let isEditing = $derived(workspace.isEditing(node));
</script>

<Stage {pixel} {size} {pixels} {isEditing} {onUpdate} />
