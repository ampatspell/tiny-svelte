<script lang="ts">
  import Inspector from '$components/basic/inspector/inspector.svelte';
  import type { WorkspaceAssetModel } from '$lib/models/project/workspace/asset.svelte';
  import Project from '../project/project.svelte';

  let {
    asset,
  }: {
    asset: WorkspaceAssetModel;
  } = $props();

  let model = $derived(asset.asset);
</script>

<Inspector>
  <Project {model} />
</Inspector>
