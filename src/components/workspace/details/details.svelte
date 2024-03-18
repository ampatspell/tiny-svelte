<script lang="ts">
  import Sidebar from '$components/basic/sidebar/sidebar.svelte';
  import Tab from '$components/basic/tabs/tab.svelte';
  import Tabs from '$components/basic/tabs/tabs.svelte';
  import type { WorkspaceModel } from '$lib/models/project/workspace/workspace.svelte';

  let {
    workspace
  }: {
    workspace: WorkspaceModel;
  } = $props();

  let project = $derived(workspace.project);

  let selected = $state('selected');
  let onSelect = (next: string) => (selected = next);
</script>

<div class="details">
  <Sidebar>
    <Tabs {selected} {onSelect}>
      <Tab id="selected" name="Selected">
        {workspace.selectedNode || workspace}
      </Tab>
      <Tab id="project" name="Project">
        {project}
      </Tab>
    </Tabs>
  </Sidebar>
</div>

<style lang="scss">
  .details {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
</style>
