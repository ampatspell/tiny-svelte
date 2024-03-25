<script lang="ts">
  import type { HasLoad } from '$lib/firebase/fire/firebase.svelte';
  import type { Snippet } from 'svelte';

  let {
    model,
    children
  }: {
    model: HasLoad<unknown>;
    children?: Snippet;
  } = $props();
</script>

{#await model.load()}
  <div class="loading">Loading…</div>
{:then}
  {#if children}
    {@render children()}
  {/if}
{:catch error}
  <div class="error">{error.error}</div>
{/await}

<style lang="scss">
  .loading,
  .error {
    padding: 10px 15px;
  }
</style>
