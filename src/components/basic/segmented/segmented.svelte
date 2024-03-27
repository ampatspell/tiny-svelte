<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    width,
    children,
  }: {
    width?: number;
    children?: Snippet;
  } = $props();
</script>

<div class="segmented" style:--segment-width="{width ?? 0}px">
  {#if children}
    {@render children()}
  {/if}
</div>

<style lang="scss">
  .segmented {
    width: 100%;
    display: grid;
    grid-auto-columns: minmax(var(--segment-width), 1fr);
    grid-auto-flow: column;
    border-radius: 3px;
    border: 1px solid #eee;
    padding: 1px;
    user-select: none;
  }
</style>
