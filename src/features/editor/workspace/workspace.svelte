<script lang="ts">
  import Loadable from '$components/basic/loadable.svelte';
  import Details from '$features/editor/workspace/inspector/inspector.svelte';
  import Sidebar from '$features/editor/workspace/sidebar/sidebar.svelte';
  import Toolbar from '$features/editor/workspace/toolbar/toolbar.svelte';
  import Workspace from './workspace/workspace.svelte';
  import type { WorkspaceModel } from '$lib/models/project/workspace/workspace.svelte';

  let { workspace }: { workspace: WorkspaceModel } = $props();
</script>

<Loadable model={workspace}>
  <div class="page">
    <div class="section left">
      <Sidebar {workspace} />
    </div>
    <div class="section content">
      <div class="toolbar">
        <Toolbar {workspace} />
      </div>
      <div class="workspace">
        <Workspace {workspace} />
      </div>
    </div>
    <div class="section right">
      <Details {workspace} />
    </div>
  </div>
</Loadable>

<style lang="scss">
  .page {
    flex: 1;
    display: flex;
    flex-direction: row;
    > .section {
      display: flex;
      flex-direction: column;
      &.left {
        width: 250px;
        border-right: 1px solid fade-out(#000, 0.95);
      }
      &.content {
        flex: 1;
        display: flex;
        flex-direction: column;
        > .workspace {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
      }
      &.right {
        width: 250px;
        border-left: 1px solid fade-out(#000, 0.95);
      }
    }
  }
</style>
