<script lang="ts">
  import Inspector from '$components/basic/inspector/inspector.svelte';
  import Item from '$components/basic/inspector/item.svelte';
  import Delete from '$components/basic/inspector/item/delete.svelte';
  import Identifier from '$components/basic/inspector/item/identifier.svelte';
  import NodeIdentity from '$components/basic/inspector/item/node-identity.svelte';
  import Pixel from '$components/basic/inspector/item/pixel.svelte';
  import Position from '$components/basic/inspector/item/position.svelte';
  import Section from '$components/basic/inspector/section.svelte';
  import type { WorkspaceNodeModel } from '$lib/models/project/workspace/node.svelte';
  import Box from './box.svelte';

  let {
    node
  }: {
    node: WorkspaceNodeModel;
  } = $props();

  let asset = $derived(node.asset);
</script>

<Inspector>
  <Section>
    <NodeIdentity model={node} />
    <Identifier model={node} />
    <Position model={node} />
    <Pixel model={node} />
    {#if asset}
      <Item title="Asset">
        {asset}
      </Item>
      {#if asset.type === 'box'}
        <Box {node} />
      {/if}
    {/if}
    <Delete model={node} />
  </Section>
</Inspector>
