<script lang="ts">
  import type { Snippet } from 'svelte';

  let { children }: { children?: Snippet } = $props();
</script>

{#if children}
  <div class="accessories">
    {@render children()}
  </div>
{/if}
