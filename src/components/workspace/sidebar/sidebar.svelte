<script lang="ts">
  import type { WorkspaceModel } from '$lib/models/project/workspace/workspace.svelte';
  import Assets from './assets.svelte';
  import Nodes from './nodes.svelte';
  import Workspaces from './workspaces.svelte';

  let {
    workspace
  }: {
    workspace: WorkspaceModel;
  } = $props();

  let project = $derived(workspace.project);
  let workspaces = $derived(project.workspaces);
</script>

<div class="sidebar">
  <div class="section">
    <div class="title">Workspaces</div>
    <Workspaces {workspaces} selected={workspace} />
  </div>
  <div class="section">
    <div class="title">Assets</div>
    <Assets assets={workspace.assets} />
  </div>
  <div class="section">
    <div class="title">Nodes</div>
    <Nodes nodes={workspace.nodes} />
  </div>
</div>

<style lang="scss">
  .sidebar {
    display: flex;
    flex-direction: column;
    gap: 20px;
    > .section {
      > .title {
        padding: 10px;
        font-weight: 600;
        border-bottom: 1px solid fade-out(#000, 0.95);
      }
    }
  }
</style>
