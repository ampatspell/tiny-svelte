<script lang="ts">
  import Sidebar from '$components/basic/sidebar/sidebar.svelte';
  import Tab from '$components/basic/tabs/tab.svelte';
  import Tabs from '$components/basic/tabs/tabs.svelte';
  import type { WorkspaceModel } from '$lib/models/project/workspace/workspace.svelte';
  import Assets from './assets.svelte';
  import Nodes from './nodes.svelte';
  import Workspaces from './workspaces.svelte';

  let {
    workspace,
  }: {
    workspace: WorkspaceModel;
  } = $props();

  let project = $derived(workspace.project);
  let workspaces = $derived(project.workspaces);

  let selected = $state('assets');
  let onSelect = (next: string) => (selected = next);
</script>

<div class="sidebar">
  <Sidebar>
    <Tabs {selected} {onSelect}>
      <Tab id="assets" name="Assets">
        <Assets assets={workspace.assets} />
      </Tab>
      <Tab id="nodes" name="Nodes">
        <Nodes nodes={workspace.nodes} />
      </Tab>
      <Tab id="workspaces" name="Workspaces">
        <Workspaces {workspaces} selected={workspace} />
      </Tab>
    </Tabs>
  </Sidebar>
</div>

<style lang="scss">
  .sidebar {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
</style>
