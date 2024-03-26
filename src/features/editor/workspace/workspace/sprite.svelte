<script lang="ts">
  import type { ProjectSpriteAssetModel } from '$lib/models/project/asset.svelte';
  import type { WorkspaceNodeModel } from '$lib/models/project/workspace/node.svelte';
  import { multiplySize } from '$lib/utils/math';
  import { getWorkspaceContext } from './base/model.svelte';

  let { node }: { node: WorkspaceNodeModel } = $props();
  let asset = $derived(node.asset as ProjectSpriteAssetModel);
  let context = getWorkspaceContext();

  let size = $derived(multiplySize(asset.size, context.pixel * node.pixel));
</script>

<div class="sprite">sprite</div>

<style lang="scss">
  .sprite {
    width: 100px;
    height: 100px;
    background: red;
  }
</style>
