<script lang="ts">
  import type { Snippet } from 'svelte';
  import { getWorkspaceContext, ToolType, type NodeModel } from './model.svelte';
  import { addPoints, multiplyPoint } from '$lib/utils/math';
  import { draggable } from '$lib/utils/use-draggable.svelte';
  import Resizable from './resizable.svelte';

  let { model, children } = $props<{
    model: NodeModel;
    children: Snippet;
  }>();

  let workspace = getWorkspaceContext();
  let workspacePixel = $derived(workspace.pixel);

  let nodePixel = $derived(model.pixel);
  let name = $derived(model.name);
  let description = $derived(model.description);
  let position = $derived(model.position);
  let onResize = $derived(model.onResize);
  let onPosition = $derived(model.onPosition);
  let size = $derived(model.size);
  let step = $derived(model.step);

  let isSelectedAndHasTools = (types: ToolType[]) => {
    return workspace.selected === model && types.includes(workspace.tool.type);
  };

  let isResizable = $derived(isSelectedAndHasTools([ToolType.Resize]));
  let isDraggable = $derived(isSelectedAndHasTools([ToolType.Idle, ToolType.Resize]));

  let onShouldStart = () => {
    if ([ToolType.Idle, ToolType.Resize].includes(workspace.tool.type)) {
      workspace.select(model);
    }
    return isDraggable;
  };

  let onDragStart = () => (workspace.dragging = model);
  let onDragEnd = () => (workspace.dragging = undefined);

  let onResizeStart = () => (workspace.resizing = model);
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
    <div class="name">{name}</div>
    {#if description}
      <div class="description">{description}</div>
    {/if}
  </div>
  <Resizable
    pixel={workspacePixel * nodePixel}
    {step}
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
