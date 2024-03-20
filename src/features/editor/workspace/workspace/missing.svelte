<script lang="ts">
  import type { WorkspaceNodeModel } from '$lib/models/project/workspace/node.svelte';
  import { getWorkspaceContext } from './content/model.svelte';

  let { node }: { node: WorkspaceNodeModel } = $props();
  let workspace = getWorkspaceContext();

  let size = $derived(workspace.pixel * 5);
</script>

<div class="missing" style:--size="{size * 3}px">
  <div class="message">Asset "{node.identifier}" is missing</div>
</div>

<style lang="scss">
  .missing {
    background: #e63946;
    color: #fff;
    min-width: 200px;
    min-height: 30px;
    width: var(--size);
    height: var(--size);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0 10px;
    > .message {
      max-width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
</style>
