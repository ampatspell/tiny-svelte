<script lang="ts">
  import type { Size } from '$lib/types';
  import { getWorkspaceContext } from '$lib/workspace/model.svelte';

  let { size, color } = $props<{
    size: Size;
    color: string;
  }>();

  let workspace = getWorkspaceContext();
  let pixel = $derived(workspace.pixel);
</script>

<div
  class="box"
  style:--width="{size.width * pixel}px"
  style:--height="{size.height * pixel}px"
  style:--color={color}
></div>

<style lang="scss">
  .box {
    width: var(--width);
    height: var(--height);
    background: var(--color);
    opacity: 0.1;
  }
</style>
