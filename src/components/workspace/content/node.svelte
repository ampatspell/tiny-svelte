<script lang="ts">
  import type { Snippet } from 'svelte';
  import { getWorkspaceContext, ToolType } from './model.svelte';
  import { addPoints, multiplyPoint } from '$lib/utils/math';
  import { draggable } from '$lib/utils/use-draggable.svelte';
  import Resizable from './resizable.svelte';
  import type { WorkspaceNodeModel } from '$lib/models/project/workspace/node.svelte';

  let {
    node,
    children
  }: {
    node: WorkspaceNodeModel;
    children: Snippet;
  } = $props();

  let workspace = getWorkspaceContext();
  let workspacePixel = $derived(workspace.pixel);

  let nodePixel = $derived(node.pixel);
  let identifier = $derived(node.identifier);
  let description = $derived(node.description);
  let position = $derived(node.position);
  let onResize = $derived(node.onResize);
  let onPosition = $derived(node.onPosition);
  let size = $derived(node.size ?? { width: 0, height: 0 });
  let resizeStep = $derived(node.resizeStep ?? 1);

  let isSelectedAndHasTools = (types: ToolType[]) => {
    return workspace.selected === node && types.includes(workspace.tool.type);
  };

  let isResizable = $derived(isSelectedAndHasTools([ToolType.Resize]) && node.isResizable);
  let isDraggable = $derived(isSelectedAndHasTools([ToolType.Idle, ToolType.Resize]));

  let onShouldStart = () => {
    if ([ToolType.Idle, ToolType.Resize].includes(workspace.tool.type)) {
      workspace.select(node);
    }
    return isDraggable;
  };

  let onDragStart = () => (workspace.dragging = node);
  let onDragEnd = () => (workspace.dragging = undefined);

  let onResizeStart = () => (workspace.resizing = node);
  let onResizeEnd = () => (workspace.resizing = undefined);

  let translate = $derived.by(() => {
    let point = multiplyPoint(addPoints(workspace.position, position), workspacePixel);
    return `${point.x}px ${point.y}px`;
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
    onStart: onDragStart,
    onEnd: onDragEnd
  }}
>
  <div class="header">
    <div class="name">{identifier}</div>
    {#if description}
      <div class="description">{description}</div>
    {/if}
  </div>
  <Resizable
    pixel={workspacePixel * nodePixel}
    step={resizeStep}
    {position}
    {size}
    {isResizable}
    {onResize}
    onStart={onResizeStart}
    onEnd={onResizeEnd}
  >
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
