<script lang="ts">
  import Item from '$components/basic/list/item.svelte';
  import List from '$components/basic/list/list.svelte';
  import type { WorkspaceNodeModel } from '$lib/models/project/workspace/node.svelte';
  import type { WorkspaceNodesModel } from '$lib/models/project/workspace/nodes.svelte';
  import Alert from '$icons/lucide-circle-alert.svelte';

  let { nodes }: { nodes: WorkspaceNodesModel } = $props();
  let selected = $derived(nodes.workspace.selectedNode.node);
  let onSelect = (node?: WorkspaceNodeModel) => {
    console.log('select', node);
    nodes.workspace.selectNode(node);
  };
</script>

<div class="content">
  <List onClick={() => onSelect()}>
    {#each nodes.all as node (node)}
      <Item isSelected={selected === node} onClick={() => onSelect(node)}>
        <div class="item">
          <div class="node">
            <div class="identifier">{node.identifier}</div>
            {#if node.asset}
              <div class="asset">
                <div class="type">{node.asset.type}</div>
                <div class="description">{node.asset.humanShortDescription}</div>
              </div>
            {:else}
              <div class="missing">asset missing</div>
            {/if}
          </div>
          <div class="accessories">
            {#if !node.asset}
              <div class="icon missing"><Alert /></div>
            {/if}
          </div>
        </div>
      </Item>
    {/each}
  </List>
</div>

<style lang="scss">
  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .item {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 5px;
    > .node {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 2px;
      > .identifier {
        font-weight: 600;
      }
      > .asset {
        display: flex;
        flex-direction: row;
        gap: 5px;
        > .description {
          color: fade-out(#000, 0.5);
        }
      }
    }
    > .accessories {
      > .icon {
        :global(> svg) {
          width: 16px;
        }
        &.missing {
          color: #e63946;
        }
      }
    }
  }
</style>
