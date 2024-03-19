<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { WorkspaceNodeModel } from '$lib/models/project/workspace/node.svelte';
  import { getWorkspaceContext, ToolType } from './model.svelte';
  import { asResizableAssetModel, type ProjectAssetModel, type WithResizableAssetModelCallback } from '$lib/models/project/asset.svelte';
  import { zeroSize } from '$lib/utils/math';
  import Resizable from '$components/basic/resizable/resizable.svelte';

  let {
    node,
    onIsResizable,
    children
  }: {
    node: WorkspaceNodeModel;
    onIsResizable: (next: boolean) => void;
    children: Snippet;
  } = $props();

  let workspace = getWorkspaceContext();
  let workspacePixel = $derived(workspace.pixel);
  let nodePixel = $derived(node.pixel);
  let pixel = $derived(workspacePixel * nodePixel);
  let position = $derived(node.position);

  let asset = $derived(node.asset);

  let asResizable = <R,>(cb: WithResizableAssetModelCallback<ProjectAssetModel, R>, fallback: () => R): R => {
    return asResizableAssetModel<ProjectAssetModel, R>(asset, cb, fallback);
  };

  let isAssetResizable = $derived(
    asResizable(
      (asset) => asset.isResizable,
      () => false
    )
  );

  let size = $derived(
    asResizable(
      (asset) => asset.size,
      () => zeroSize()
    )
  );

  let step = $derived(
    asResizable(
      (asset) => asset.step,
      () => 1
    )
  );

  let onResize = $derived(
    asResizable(
      (asset) => asset.onResize,
      () => () => {}
    )
  );

  let isSelectedWithResize = $derived(workspace.isSelectedAndHasTools(node, [ToolType.Resize]));
  let isResizable = $derived(isSelectedWithResize && isAssetResizable);

  let onStart = () => (workspace.resizing = node);
  let onEnd = () => (workspace.resizing = undefined);

  $effect.pre(() => {
    onIsResizable(isResizable);
  });
</script>

<Resizable {pixel} {step} {position} {size} {isResizable} {onResize} {onStart} {onEnd}>
  {@render children()}
</Resizable>
