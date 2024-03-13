<script lang="ts">
  import { isLoadable, type HasActivator, type Loadable, allLoadableDependencies } from '$lib/firebase/firestore.svelte';
  import type { Snippet } from 'svelte';

  let {
    model,
    children
  }: {
    model: HasActivator;
    children?: Snippet;
  } = $props();

  let loadable = $derived(allLoadableDependencies(model));

  let isLoaded = $derived(!loadable.find((model) => !model.isLoaded));
  let isLoading = $derived(!loadable.find((model) => !model.isLoading));
  let error = $derived(loadable.find((model) => model.error));
</script>

{#if isLoaded}
  {#if children}
    {@render children()}
  {/if}
{:else if isLoading}
  <div class="loading">Loading…</div>
{:else if error}
  <div class="error">{error.error}</div>
{/if}

<style lang="scss">
  .loading,
  .error {
    padding: 10px 15px;
  }
</style>
