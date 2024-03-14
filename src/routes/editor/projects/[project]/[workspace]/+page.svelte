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
    <div class="row">{workspace.nodes}</div>
    {#each workspace.nodes.query.content as node}
      <div class="row">{node}</div>
    {/each}
    <div class="row">{workspace.project.assets}</div>
    {#each workspace.project.assets.query.content as node}
      <div class="row">{node}</div>
    {/each}
  </div>
</Loadable>

<style lang="scss">
  .page {
    padding: 10px;
  }
</style>
