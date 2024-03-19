<script lang="ts">
  import Item from '$components/basic/list/item.svelte';
  import List from '$components/basic/list/list.svelte';
  import type { WorkspaceAssetsModel } from '$lib/models/project/workspace/assets.svelte';

  let { assets }: { assets: WorkspaceAssetsModel } = $props();
</script>

<List>
  {#each assets.all as asset (asset)}
    <Item>
      <div class="asset">
        <div class="row">
          {asset.asset.type}
          {asset.asset.identifier}
        </div>
        {#if asset.node}
          <div class="row">
            [{asset.node.position.x},{asset.node.position.y}] @ {asset.node.pixel}px
          </div>
        {/if}
      </div>
    </Item>
  {/each}
</List>
