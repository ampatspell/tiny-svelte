<script lang="ts">
  import type { ProjectBoxAssetModel } from '$lib/models/project/asset.svelte';
  import type { WorkspaceNodeModel } from '$lib/models/project/workspace/node.svelte';
  import { multiplySize } from '$lib/utils/math';
  import { getWorkspaceContext } from './content/model.svelte';

  let { node }: { node: WorkspaceNodeModel } = $props();
  let asset = $derived(node.asset as ProjectBoxAssetModel);
  let context = getWorkspaceContext();

  let size = $derived(multiplySize(asset.size, context.pixel * node.pixel));
  let color = $derived(asset.color);
</script>

<div class="box" style:--width="{size.width}px" style:--height="{size.height}px" style:--color={color}></div>

<style lang="scss">
  .box {
    width: var(--width);
    height: var(--height);
    background: var(--color);
    opacity: 1;
  }
</style>
