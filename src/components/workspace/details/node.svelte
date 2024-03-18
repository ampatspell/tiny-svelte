<script lang="ts">
  import Inspector from '$components/basic/inspector/inspector.svelte';
  import Item from '$components/basic/inspector/item.svelte';
  import Section from '$components/basic/inspector/section.svelte';
  import type { WorkspaceNodeModel } from '$lib/models/project/workspace/node.svelte';

  let {
    node
  }: {
    node: WorkspaceNodeModel;
  } = $props();

  let asset = $derived(node.asset);
</script>

<Inspector>
  <Section>
    <Item title="Identifier">
      {node.identifier}
    </Item>
    <Item title="Position">
      {node.position.x}, {node.position.y}
    </Item>
    <Item title="Pixel">
      {node.pixel}
    </Item>
    {#if asset}
      <Item title="Asset">
        {asset}
      </Item>
    {/if}
  </Section>
</Inspector>
