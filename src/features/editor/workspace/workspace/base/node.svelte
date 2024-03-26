<script lang="ts">
  import type { Snippet } from 'svelte';
  import { getWorkspaceContext } from './model.svelte';
  import { addPoints, multiplyPoint } from '$lib/utils/math';
  import { draggable } from '$lib/utils/use-draggable.svelte';
  import type { WorkspaceNodeModel } from '$lib/models/project/workspace/node.svelte';
  import Resizable from './resizable.svelte';
  import { ToolType } from '$lib/models/project/workspace/workspace.svelte';
  import { asResizableAssetModel } from '$lib/models/project/asset.svelte';
  import type { Border } from '$components/basic/resizable/models.svelte';

  let {
    node,
    children
  }: {
    node: WorkspaceNodeModel;
    children: Snippet;
  } = $props();

  let workspace = getWorkspaceContext();
  let workspacePixel = $derived(workspace.pixel);

  let identifier = $derived(node.identifier);
  let position = $derived(node.position);
  let onPosition = $derived(node.onPosition);

  let asset = $derived(node.asset);
  let description = $derived(asset?.humanShortDescription);

  let isDraggable = $derived(workspace.isSelectedAndHasTools(node, [ToolType.Idle, ToolType.Resize]));

  let isAssetResizable = $derived.by(() => {
    return asResizableAssetModel(asset, (asset) => asset.isResizable) ?? false;
  });
  let isSelectedWithResizeTool = $derived(workspace.isSelectedAndHasTools(node, [ToolType.Resize]));
  let isResizable = $derived(isSelectedWithResizeTool && isAssetResizable);

  let onShouldStart = () => {
    if ([ToolType.Idle, ToolType.Resize].includes(workspace.tool.type)) {
      workspace.selectNode(node);
    }
    return isDraggable;
  };

  let onStart = () => (workspace.dragging = node);
  let onEnd = () => (workspace.dragging = undefined);

  let translate = $derived.by(() => {
    let point = multiplyPoint(addPoints(workspace.position, position), workspacePixel);
    return `${point.x}px ${point.y}px`;
  });

  let border: Border = $derived.by(() => {
    if (isResizable) {
      return 'warning';
    } else if (isDraggable) {
      return 'focus';
    }
    return 'idle';
  });
</script>

<div
  class="node"
  class:resizable={isResizable}
  style:translate
  use:draggable={{
    isDraggable,
    onShouldStart,
    pixel: workspacePixel,
    position,
    onPosition,
    onStart,
    onEnd
  }}
>
  <div class="header">
    <div class="name">{identifier}</div>
    {#if description}
      <div class="description" title={description}>{description}</div>
    {/if}
  </div>
  <Resizable {node} {border} {isResizable}>
    {@render children()}
  </Resizable>
</div>

<style lang="scss">
  .node {
    position: absolute;
    > .header {
      position: absolute;
      top: -11px;
      left: 0;
      user-select: none;
      min-width: 0;
      max-width: 100%;
      gap: 3px;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      font-size: 11px;
      color: fade-out(#000, 0.5);
      > .name,
      > .description {
        display: inline;
      }
      > .name {
        color: #000;
      }
    }
    &.resizable {
      > .header {
        display: none;
      }
    }
  }
</style>
