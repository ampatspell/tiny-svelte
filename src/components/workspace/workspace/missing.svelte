<script lang="ts">
  import type { WorkspaceNodeModel } from '$lib/models/project/workspace/node.svelte';
  import { getWorkspaceContext } from '../content/model.svelte';

  let { node }: { node: WorkspaceNodeModel } = $props();

  let workspace = getWorkspaceContext();
</script>

<div class="missing">
  <div class="message">Asset missing</div>
</div>

<style lang="scss">
  .missing {
    background: fade-out(red, 0.5);
    color: #fff;
    font-weight: 600;
    width: 120px;
    height: 120px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
</style>
