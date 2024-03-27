<script lang="ts">
  import Size from '$components/basic/inspector/item/size.svelte';
  import type { ProjectSpriteAssetModel } from '$lib/models/project/asset.svelte';
  import type { WorkspaceNodeModel } from '$lib/models/project/workspace/node.svelte';

  let {
    node,
  }: {
    node: WorkspaceNodeModel;
  } = $props();

  let asset = $derived(node.asset as ProjectSpriteAssetModel);
</script>

<Size model={asset} />
