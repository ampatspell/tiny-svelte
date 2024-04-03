<script lang="ts">
  import type { WorkspaceAssetModel } from '$lib/models/project/workspace/asset.svelte';
  import type { WorkspaceAssetsModel } from '$lib/models/project/workspace/assets.svelte';
  import Accessories from './-list/accessories/accessories.svelte';
  import Check from './-list/accessories/check.svelte';
  import Content from './-list/content/content.svelte';
  import Description from './-list/content/description.svelte';
  import Identifier from './-list/content/identifier.svelte';
  import List from './-list/list.svelte';

  let { assets }: { assets: WorkspaceAssetsModel } = $props();

  let workspace = $derived(assets.workspace);
  let all = $derived(assets.all);

  let selectedNode = $derived(workspace.selectedNode.node);

  let selected = $derived.by(() => {
    if(selectedNode) {
      const node = selectedNode;
      return all.find((asset) => asset.nodes.includes(node));
    }
  });

  let onSelect = (asset?: WorkspaceAssetModel) => {
    // let node = asset?.node;
    // workspace.selectNode(node);
  };
</script>

<List {all} {selected} {onSelect}>
  {#snippet children(asset)}
    <Content>
      <Identifier value={asset.asset.identifier} />
      <Description type={asset.asset.type} description={asset.asset.humanShortDescription} />
    </Content>
    <Accessories>
      {#if asset.nodes.length}
        <Check />
      {/if}
    </Accessories>
  {/snippet}
</List>
