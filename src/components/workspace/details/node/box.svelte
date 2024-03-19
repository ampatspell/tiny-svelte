<script lang="ts">
  import String from '$components/basic/inspector/item/string.svelte';
  import type { ProjectBoxAssetModel } from '$lib/models/project/asset.svelte';
  import type { WorkspaceNodeModel } from '$lib/models/project/workspace/node.svelte';

  let {
    node
  }: {
    node: WorkspaceNodeModel;
  } = $props();

  let asset = $derived(node.asset as ProjectBoxAssetModel);
</script>

<String title="Color" value={asset.color} onValue={asset.onColor} />
