<script lang="ts">
  import Size from '$components/basic/inspector/item/size.svelte';
  import type { ProjectAssetModel, ProjectSpriteAssetModel } from '$lib/models/project/asset.svelte';

  let {
    model,
  }: {
    model: ProjectAssetModel;
  } = $props();

  let asset = $derived(model as ProjectSpriteAssetModel);
</script>

<Size model={asset} />
