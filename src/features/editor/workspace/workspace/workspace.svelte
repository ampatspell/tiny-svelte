<script lang="ts">
  import type { WorkspaceModel } from '$lib/models/project/workspace/workspace.svelte';
  import { WorkspaceContext } from './base/model.svelte';
  import Node from './node.svelte';
  import Base from './base/base.svelte';

  let {
    workspace,
  }: {
    workspace: WorkspaceModel;
  } = $props();

  let context = new WorkspaceContext({ workspace });
</script>

<div class="workspace">
  <Base class="content" {context}>
    {#each workspace.nodes.all as node (node)}
      <Node {node} />
    {/each}
  </Base>
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
