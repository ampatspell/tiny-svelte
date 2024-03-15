<script lang="ts">
  import Loadable from '$components/basic/loadable.svelte';
  import { activate } from '$lib/firebase/firestore.svelte';
  import type { WorkspaceModel } from '$lib/models/project.svelte';

  let { data }: { data: { workspace: WorkspaceModel } } = $props();

  let workspace = $derived(data.workspace);
  $effect(() => activate(workspace));

  let project = $derived(data.workspace.project);
  let workspaces = $derived(project.workspaces);
</script>

<Loadable model={workspace}>
  <div class="page">
    <div class="section">
      <div class="title">Project</div>
      <div class="row">{workspace.project}</div>
    </div>
    <div class="section">
      <div class="title">Workspaces</div>
      {#each workspaces.query.content as workspace (workspace)}
        <a href="/editor/projects/{project.id}/{workspace.id}">{workspace.data?.identifier}</a>
      {/each}
    </div>
    <div class="section">
      <div class="title">Workspace</div>
      <div class="row">{workspace}</div>
    </div>
    <div class="section">
      <div class="title">Nodes</div>
      <div class="row">{workspace.nodes}</div>
    </div>
    <div class="section">
      <div class="title">Nodes content</div>
      {#each workspace.nodes.query.content as node (node)}
        <div class="row">{node}</div>
      {/each}
    </div>
    <div class="section">
      <div class="title">Assets</div>
      <div class="row">{workspace.project.assets}</div>
    </div>
    <div class="section">
      <div class="title">Assets content</div>
      {#each workspace.project.assets.query.content as node (node)}
        <div class="row">{node}</div>
      {/each}
    </div>
  </div>
</Loadable>

<style lang="scss">
  .page {
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 15px;
    > .section {
      display: flex;
      flex-direction: column;
      gap: 5px;
      > .title {
        font-weight: 600;
      }
    }
  }
</style>
