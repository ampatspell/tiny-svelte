<script lang="ts">
  import { type WorkspaceModel } from '$lib/models/project/workspace/workspace.svelte';
  import Tools from './tools.svelte';

  let {
    workspace,
  }: {
    workspace: WorkspaceModel;
  } = $props();
</script>

<div class="toolbar">
  <div class="tools">
    <Tools {workspace} />
  </div>
</div>

<style lang="scss">
  .toolbar {
    padding: 5px;
    display: flex;
    flex-direction: row;
    gap: 5px;
    border-bottom: 1px solid fade-out(#000, 0.95);
  }
</style>
