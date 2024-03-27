<script lang="ts">
  import { classes, type Classes } from '$lib/utils/classes';
  import { resize } from '$lib/utils/use-resize.svelte';
  import { draggable } from '$lib/utils/use-draggable.svelte';
  import type { Snippet } from 'svelte';
  import { setWorkspaceContext, WorkspaceContext } from './model.svelte';
  import { space } from '$lib/utils/use-space.svelte';
  import type { OptionalVoidCallback } from '$lib/types/types';
  import { ToolType } from '$lib/models/project/workspace/workspace.svelte';

  let {
    class: _class,
    context,
    children,
  }: {
    class?: Classes;
    context: WorkspaceContext;
    children?: Snippet;
  } = $props();

  setWorkspaceContext(context);

  let position = $derived(context.position);
  let pixel = $derived(context.pixel);
  let onResize = $derived(context.onResize);
  let onPosition = $derived(context.onPosition);

  let element = $state<HTMLDivElement>();
  let onClick = (e: Event) => {
    if (e.target === element) {
      context.selectNode(undefined);
    }
  };

  let cancelDrag: OptionalVoidCallback;
  let onSpaceDown = () => {
    if (context.dragging || context.resizing) {
      return;
    }
    let current = context.tool.type;
    cancelDrag = () => context.tool.set(current);
    context.tool.set(ToolType.WorkspaceDrag);
  };

  let onSpaceUp = () => {
    if (!cancelDrag) {
      return;
    }
    cancelDrag();
    cancelDrag = undefined;
  };

  let isDraggable = $derived(context.tool.type === ToolType.WorkspaceDrag);
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class={classes('workspace', _class)}
  bind:this={element}
  use:resize={{ onResize }}
  use:draggable={{
    isDraggable,
    position,
    pixel,
    onPosition,
  }}
  use:space={{ onSpaceDown, onSpaceUp }}
  onmousedown={onClick}
>
  {#if children}
    {@render children()}
  {/if}
</div>

<style lang="scss">
  .workspace {
    background: fade-out(#000, 0.97);
    position: relative;
    overflow: hidden;
    user-select: none;
  }
</style>
