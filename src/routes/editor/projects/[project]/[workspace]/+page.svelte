<script lang="ts">
  import Loadable from '$components/basic/loadable.svelte';
  import { activate } from '$lib/firebase/firestore.svelte';

  let { data } = $props();

  let workspace = $derived(data.workspace);
  $effect(() => activate(workspace));

  let project = $derived(data.workspace.project);
  // let workspaces = $derived(project.workspaces);
</script>

<Loadable model={workspace}>
  <div class="page">
    <!-- <div class="left"></div> -->

    <div class="content">
      {#each project.assets.all as asset}
        <div class="row">{asset}</div>
      {/each}
    </div>

    <div class="content">
      {#each workspace.nodes.all as node}
        <div class="row">{node}</div>
      {/each}
    </div>

    <!-- <div class="right"></div> -->
  </div>
</Loadable>

<style lang="scss">
  .page {
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;

    // flex: 1;
    // display: flex;
    // flex-direction: row;
    // > .left {
    //   width: 250px;
    //   border-right: 1px solid fade-out(#000, 0.95);
    // }
    // > .content {
    //   flex: 1;
    // }
    // > .right {
    //   width: 250px;
    //   border-left: 1px solid fade-out(#000, 0.95);
    // }
  }
</style>
