<script lang="ts">
  import Sidebar from '$components/basic/sidebar/sidebar.svelte';
  import Tab from '$components/basic/tabs/tab.svelte';
  import Tabs from '$components/basic/tabs/tabs.svelte';
  import type { WorkspaceNodeModel } from '$lib/models/project/workspace/node.svelte';
  import type { WorkspaceModel } from '$lib/models/project/workspace/workspace.svelte';
  import { setGlobal } from '$lib/utils/set-global';
  import Footer from './footer.svelte';
  import Node from './node/node.svelte';
  import Project from './project.svelte';
  import Workspace from './workspace.svelte';

  let {
    workspace,
  }: {
    workspace: WorkspaceModel;
  } = $props();

  let selected = $state('selected');
  let onSelect = (next: string) => (selected = next);

  let project = $derived(workspace.project);
  // TODO: selection
  let node: WorkspaceNodeModel | undefined = undefined; // $derived(workspace.selectedNode.node);

  setGlobal({ workspace });
</script>

<div class="details">
  <div class="sidebar">
    <Sidebar>
      <Tabs {selected} {onSelect}>
        <Tab id="selected" name="Selected">
          {#if node}
            <Node {node} />
          {:else}
            <Workspace {workspace} />
          {/if}
        </Tab>
        <Tab id="project" name="Project">
          <Project {project} />
        </Tab>
      </Tabs>
    </Sidebar>
  </div>
  <div class="footer">
    <Footer {workspace} />
  </div>
</div>

<style lang="scss">
  .details {
    flex: 1;
    display: flex;
    flex-direction: column;
    > .sidebar {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    > .footer {
      border-top: 1px solid fade-out(#000, 0.97);
    }
  }
</style>
