<script lang="ts">
  import Sidebar from '$components/basic/sidebar/sidebar.svelte';
  import Tab from '$components/basic/tabs/tab.svelte';
  import Tabs from '$components/basic/tabs/tabs.svelte';
  import { WorkspaceAssetModel } from '$lib/models/project/workspace/asset.svelte';
  import { WorkspaceNodeModel } from '$lib/models/project/workspace/node.svelte';
  import type { WorkspaceModel } from '$lib/models/project/workspace/workspace.svelte';
  import { setGlobal } from '$lib/utils/set-global';
  import Asset from './asset/asset.svelte';
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
  let selection = $derived(workspace.selection.selected);

  setGlobal({ workspace });
</script>

<div class="details">
  <div class="sidebar">
    <Sidebar>
      <Tabs {selected} {onSelect}>
        <Tab id="selected" name="Selected">
          {#if selection}
            {#if selection instanceof WorkspaceNodeModel}
              <Node node={selection} />
            {:else if selection instanceof WorkspaceAssetModel}
              <Asset asset={selection} />
            {/if}
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
