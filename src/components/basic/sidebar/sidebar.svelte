<script lang="ts">
  import type { Snippet } from 'svelte';

  let { children }: { children: Snippet } = $props();
</script>

<div class="sidebar">
  {#if children}
    {@render children()}
  {/if}
</div>

<style lang="scss">
  .sidebar {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
</style>
