<script lang="ts">
  import type { Snippet } from 'svelte';

  let { children } = $props<{
    children?: Snippet;
  }>();
</script>

<div class="segmented">
  {#if children}
    {@render children()}
  {/if}
</div>

<style lang="scss">
  .segmented {
    width: 100%;
    display: grid;
    grid-auto-columns: minmax(0, 1fr);
    grid-auto-flow: column;
    border-radius: 3px;
    border: 1px solid #eee;
    padding: 1px;
  }
</style>
