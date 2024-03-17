<script lang="ts">
  import type { WorkspaceModel } from '$lib/models/project/workspace/workspace.svelte';

  let {
    workspace
  }: {
    workspace: WorkspaceModel;
  } = $props();
</script>

<div class="workspace">
  {workspace}
</div>

<style lang="scss">
  .workspace {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
</style>
