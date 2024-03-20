<script lang="ts">
  import type { WorkspaceModel } from '$lib/models/project/workspace/workspace.svelte';
  import { WorkspaceContext } from './content/model.svelte';
  import Node from './node.svelte';
  import Workspace from './content/workspace.svelte';

  let {
    workspace
  }: {
    workspace: WorkspaceModel;
  } = $props();

  let context = new WorkspaceContext({ workspace });
</script>

<div class="workspace">
  <Workspace class="content" {context}>
    {#each workspace.nodes.all as node (node)}
      <Node {node} />
    {/each}
  </Workspace>
</div>

<style lang="scss">
  .workspace {
    flex: 1;
    display: flex;
    flex-direction: column;
    :global(> .content) {
      flex: 1;
    }
  }
</style>
