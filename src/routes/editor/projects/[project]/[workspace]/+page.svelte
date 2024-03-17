<script lang="ts">
  import Loadable from '$components/basic/loadable.svelte';
  import Assets from '$components/workspace/sidebar/assets.svelte';
  import Nodes from '$components/workspace/sidebar/nodes.svelte';
  import Workspaces from '$components/workspace/sidebar/workspaces.svelte';
  import { activate } from '$lib/firebase/firestore.svelte';

  let { data } = $props();

  let workspace = $derived(data.workspace);
  $effect(() => activate(workspace));

  let project = $derived(data.workspace.project);
  let workspaces = $derived(project.workspaces);
</script>

<Loadable model={workspace}>
  <div class="page">
    <div class="left">
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
  </div>
</Loadable>

<style lang="scss">
  .page {
    flex: 1;
    display: flex;
    flex-direction: row;
    > .left {
      width: 250px;
      border-right: 1px solid fade-out(#000, 0.95);
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
    > .content {
      flex: 1;
    }
    > .right {
      width: 250px;
      border-left: 1px solid fade-out(#000, 0.95);
    }
  }
</style>
