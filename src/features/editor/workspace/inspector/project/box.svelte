<script lang="ts">
  import Size from '$components/basic/inspector/item/size.svelte';
  import String from '$components/basic/inspector/item/string.svelte';
  import type { ProjectAssetModel, ProjectBoxAssetModel } from '$lib/models/project/asset.svelte';

  let {
    model,
  }: {
    model: ProjectAssetModel;
  } = $props();

  let asset = $derived(model as ProjectBoxAssetModel);
</script>

<Size model={asset} />
<String title="Color" value={asset.color} onValue={asset.onColor} />
