<script lang="ts">
  import type { Loadable } from '$lib/firebase/firestore.svelte';
  import type { Snippet } from 'svelte';

  let { model, children } = $props<{
    model: Loadable;
    children?: Snippet;
  }>();
</script>

{#if model.isLoaded}
  {#if children}
    {@render children()}
  {/if}
{:else if model.isLoading}
  <div class="loading">Loading…</div>
{:else if model.error}
  <div class="error">{model.error}</div>
{/if}

<style lang="scss">
  .loading,
  .error {
    padding: 10px 15px;
  }
</style>
