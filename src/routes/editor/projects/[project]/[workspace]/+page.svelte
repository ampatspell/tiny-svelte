<script lang="ts">
  import Loadable from '$components/basic/loadable.svelte';
  import Sidebar from '$components/workspace/sidebar/sidebar.svelte';
  import { activate } from '$lib/firebase/firestore.svelte';

  let { data } = $props();

  let workspace = $derived(data.workspace);
  $effect(() => activate(workspace));

  let project = $derived(data.workspace.project);
</script>

<Loadable model={workspace}>
  <div class="page">
    <div class="left">
      <Sidebar {project} {workspace} />
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
