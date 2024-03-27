<script lang="ts">
  import type { WorkspaceNodeModel } from '$lib/models/project/workspace/node.svelte';
  import type { WorkspaceNodesModel } from '$lib/models/project/workspace/nodes.svelte';
  import List from './-list/list.svelte';
  import Content from './-list/content/content.svelte';
  import Accessories from './-list/accessories/accessories.svelte';
  import Missing from './-list/accessories/missing.svelte';
  import Description from './-list/content/description.svelte';
  import Identifier from './-list/content/identifier.svelte';

  let { nodes }: { nodes: WorkspaceNodesModel } = $props();

  let all = $derived(nodes.all);
  let selected = $derived(nodes.workspace.selectedNode.node);
  let onSelect = (node?: WorkspaceNodeModel) => {
    nodes.workspace.selectNode(node);
  };
</script>

<List {all} {selected} {onSelect}>
  {#snippet children(node)}
    <Content>
      <Identifier value={node.identifier} />
      {#if node.asset}
        <Description type={node.asset.type} description={node.asset.humanShortDescription} />
      {:else}
        <Description type="Asset missing" />
      {/if}
    </Content>
    {#if !node.asset}
      <Accessories>
        <Missing />
      </Accessories>
    {/if}
  {/snippet}
</List>
