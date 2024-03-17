<script lang="ts">
  import Item from '$components/basic/list/item.svelte';
  import List from '$components/basic/list/list.svelte';
  import type { WorkspaceAssetsModel } from '$lib/models/project/workspace/assets.svelte';
  import type { WorkspaceNodesModel } from '$lib/models/project/workspace/nodes.svelte';

  let { nodes }: { nodes: WorkspaceNodesModel } = $props();
</script>

<List>
  {#each nodes.all as node (node)}
    <Item>
      <div class="asset">
        {#if node.asset}
          <div class="row">
            {node.asset.type}
            {node.asset.identifier}
          </div>
        {:else}
          <div class="row">"{node.identifier}" missing</div>
        {/if}
        {#if node}
          <div class="row">{node.position.x},{node.position.y} @ {node.pixel}px</div>
        {/if}
      </div>
    </Item>
  {/each}
</List>
