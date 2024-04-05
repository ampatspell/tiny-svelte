<script lang="ts">
  import type { ProjectSceneLayerAssetModel } from '$lib/models/project/asset.svelte';
  import type { WorkspaceNodeModel } from '$lib/models/project/workspace/node.svelte';
  import { multiplySize } from '$lib/utils/math';
  import { getWorkspaceContext } from './base/model.svelte';

  let {
    node,
  }: {
    node: WorkspaceNodeModel;
  } = $props();

  let context = getWorkspaceContext();
  let asset = $derived(node.asset as ProjectSceneLayerAssetModel);

  let size = $derived(multiplySize(asset.size, context.pixel * node.pixel));
</script>

<div class="layer" style:--width="{size.width}px" style:--height="{size.height}px">
  {asset}
</div>

<style lang="scss">
  .layer {
    width: var(--width);
    height: var(--height);
    background: rgba(255, 0, 0, 0.1);
    overflow: hidden;
  }
</style>
