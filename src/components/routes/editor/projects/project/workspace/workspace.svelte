<script lang="ts">
  import Loadable from '$components/basic/loadable.svelte';
  import type { WorkspaceModel } from '$lib/models/project.svelte';

  let {
    workspace
  }: {
    workspace: WorkspaceModel;
  } = $props();
</script>

<Loadable model={workspace}>
  <div class="workspace">
    <div class="row">{workspace.project}</div>
    <div class="row">{workspace}</div>
  </div>
</Loadable>

<style lang="scss">
  .workspace {
    padding: 10px;
  }
</style>
