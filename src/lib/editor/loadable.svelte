<script lang="ts">
  import type { Loadable } from '$lib/firebase/mountable.svelte';
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
{:else if model.isError}
  <div class="error">{model.error}</div>
{/if}

<style lang="scss">
  .error {
    padding: 10px 15px;
  }
</style>
