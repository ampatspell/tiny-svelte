<script lang="ts">
  import type { Snippet } from 'svelte';
  import { getWorkspaceContext } from './model.svelte';
  import { addPoints, multiplyPoint } from '$lib/utils/math';
  import { draggable } from '$lib/utils/use-draggable.svelte';
  import type { WorkspaceNodeModel } from '$lib/models/project/workspace/node.svelte';
  import Resizable from './resizable.svelte';
  import { ToolType } from '$lib/models/project/workspace/workspace.svelte';
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

  let isDraggable = $derived(workspace.isDraggable(node));
  let isEditable = $derived(workspace.isEditing(node));
  let isResizable = $derived(workspace.isResizable(node));

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
    if (isResizable || isEditable) {
      return 'warning';
    } else if (isDraggable) {
      return 'focus';
    }
    return 'idle';
  });

  let isCompact = $derived(workspacePixel * node.pixel < 8);
</script>

<div
  class="node"
  class:resizable={isResizable}
  class:compact={isCompact}
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
    &.compact {
      > .header {
        display: none;
      }
    }
  }
</style>
