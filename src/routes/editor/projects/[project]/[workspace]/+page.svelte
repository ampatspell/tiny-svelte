<script lang="ts">
  import Loadable from '$components/basic/loadable.svelte';
  import { activate } from '$lib/firebase/firestore.svelte';
  import type { WorkspaceModel } from '$lib/models/project.svelte';

  let { data }: { data: { workspace: WorkspaceModel } } = $props();

  let workspace = $derived(data.workspace);
  $effect(() => activate(workspace));
</script>

<Loadable model={workspace}>
  <div class="page">
    <div class="row">{workspace.project}</div>
    <div class="row">{workspace}</div>
  </div>
</Loadable>

<style lang="scss">
  .page {
    padding: 10px;
  }
</style>
