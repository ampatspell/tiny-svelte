<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { WorkspaceNodeModel } from '$lib/models/project/workspace/node.svelte';
  import { getWorkspaceContext, ToolType } from './model.svelte';
  import {
    asResizableAssetModel,
    isResizableAssetModel,
    type ProjectAssetModel,
    type WithResizableAssetModelCallback
  } from '$lib/models/project/asset.svelte';
  import { zeroSize } from '$lib/utils/math';
  import Resizable from '$components/basic/resizable/resizable.svelte';
  import type { ResizeEvent } from '$lib/types/types';

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

  let asResizable = <R,>(cb: WithResizableAssetModelCallback<ProjectAssetModel, R>): R | undefined => {
    return asResizableAssetModel<ProjectAssetModel, R>(asset, cb);
  };

  let isAssetResizable = $derived.by(() => {
    return asResizable((asset) => asset.isResizable) ?? false;
  });

  let size = $derived.by(() => {
    return asResizable((asset) => asset.size) ?? zeroSize();
  });

  let step = $derived.by(() => {
    return asResizable((asset) => asset.step) ?? 1;
  });

  let onResize = (event: ResizeEvent) => {
    node.onPosition(event.position);
    if (asset && isResizableAssetModel(asset)) {
      asset.onResize(event);
    }
  };

  let isSelectedWithResizeTool = $derived(workspace.isSelectedAndHasTools(node, [ToolType.Resize]));
  let isResizable = $derived(isSelectedWithResizeTool && isAssetResizable);

  let onStart = () => (workspace.resizing = node);
  let onEnd = () => (workspace.resizing = undefined);

  $effect.pre(() => {
    onIsResizable(isResizable);
  });
</script>

<Resizable {pixel} {step} {position} {size} {isResizable} {onResize} {onStart} {onEnd}>
  {@render children()}
</Resizable>
