<script lang="ts">
  import { classes, type Classes } from '$lib/utils/classes';
  import { resize } from '$lib/utils/use-resize.svelte';
  import { draggable } from '$lib/utils/use-draggable.svelte';
  import type { Snippet } from 'svelte';
  import { setWorkspaceContext, WorkspaceModel, ToolType } from './model.svelte';
  import { space } from '$lib/utils/use-space.svelte';
  import type { OptionalVoidCallback } from '$lib/types/types';
  import type { Point } from '$lib/types/schema';

  let {
    class: _class,
    model,
    children
  } = $props<{
    class?: Classes;
    model: WorkspaceModel;
    children?: Snippet;
  }>();

  setWorkspaceContext(model);

  let position = $derived(model.position);
  let pixel = $derived(model.pixel);
  let onResize = $derived(model.onResize);
  let onPosition = (position: Point) => (model.position = position);
  let onClick = () => model.select(undefined);

  let cancelDrag: OptionalVoidCallback;
  let onSpaceDown = () => {
    if (model.dragging || model.resizing) {
      return;
    }
    let current = model.tool.type;
    cancelDrag = () => model.tool.set(current);
    model.tool.set(ToolType.WorkspaceDrag);
  };

  let onSpaceUp = () => {
    if (!cancelDrag) {
      return;
    }
    cancelDrag();
    cancelDrag = undefined;
  };

  let isDraggable = $derived(model.tool.type === ToolType.WorkspaceDrag);
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class={classes('workspace', _class)}
  use:resize={{ onResize }}
  use:draggable={{
    isDraggable,
    position,
    pixel,
    onPosition
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
  }
</style>
