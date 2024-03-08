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

  let context = getWorkspaceContext();
  let pixel = $derived(context.pixel);
  let name = $derived(model.name);
  let description = $derived(model.description);
  let position = $derived(model.position);
  let onResize = $derived(model.onResize);
  let onPosition = $derived(model.onPosition);
  let size = $derived(model.size);
  let step = $derived(model.step);

  let isSelectedAndHasTools = (types: ToolType[]) => context.selected === model && types.includes(context.tool.type);
  let isResizable = $derived(isSelectedAndHasTools([ToolType.Resize]));
  let isDraggable = $derived(isSelectedAndHasTools([ToolType.Idle, ToolType.Resize]));

  let onShouldStart = () => {
    if ([ToolType.Idle, ToolType.Resize].includes(context.tool.type)) {
      context.select(model);
    }
    return isDraggable;
  };

  let translate = $derived.by(() => {
    let point = multiplyPoint(addPoints(context.position, position), context.pixel);
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
    pixel,
    position,
    onPosition
  }}
>
  <div class="header">
    <div class="name">{name}</div>
    {#if description}
      <div class="description">{description}</div>
    {/if}
  </div>
  <Resizable {pixel} {step} {position} {size} {isResizable} {onResize} class="content">
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
