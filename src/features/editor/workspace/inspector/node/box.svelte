<script lang="ts">
  import Size from '$components/basic/inspector/item/size.svelte';
  import String from '$components/basic/inspector/item/string.svelte';
  import type { ProjectBoxAssetModel } from '$lib/models/project/asset.svelte';
  import type { WorkspaceNodeModel } from '$lib/models/project/workspace/node.svelte';

  let {
    node,
  }: {
    node: WorkspaceNodeModel;
  } = $props();

  let asset = $derived(node.asset as ProjectBoxAssetModel);
</script>

<Size model={asset} />
<String title="Color" value={asset.color} onValue={asset.onColor} />
