<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { WorkspaceNodeModel } from '$lib/models/project/workspace/node.svelte';
  import { getWorkspaceContext } from './model.svelte';
  import {
    asResizableAssetModel,
    isResizableAssetModel,
    type ProjectAssetModel,
    type WithResizableAssetModelCallback,
  } from '$lib/models/project/asset.svelte';
  import { zeroSize } from '$lib/utils/math';
  import Resizable from '$components/basic/resizable/resizable.svelte';
  import type { ResizeEvent } from '$lib/types/types';
  import type { Border } from '$components/basic/resizable/models.svelte';

  let {
    node,
    border,
    isResizable,
    children,
  }: {
    node: WorkspaceNodeModel;
    border: Border;
    isResizable: boolean;
    children: Snippet;
  } = $props();

  let workspace = getWorkspaceContext();
  let externalPixel = $derived(workspace.pixel);
  let internalPixel = $derived(node.pixel);
  let position = $derived(node.position);

  let asset = $derived(node.asset);

  let asResizable = <R,>(cb: WithResizableAssetModelCallback<ProjectAssetModel, R>): R | undefined => {
    return asResizableAssetModel<ProjectAssetModel, R>(asset, cb);
  };

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

  let onStart = () => (workspace.resizing = node);
  let onEnd = () => (workspace.resizing = undefined);
</script>

<Resizable {border} {externalPixel} {internalPixel} {step} {position} {size} {isResizable} {onResize} {onStart} {onEnd}>
  {@render children()}
</Resizable>
