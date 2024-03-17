<script lang="ts">
  import type { VoidCallback } from '$lib/types/types';
  import type { Snippet } from 'svelte';

  let {
    route,
    children,
    onClick
  }: {
    children?: Snippet;
    route?: string;
    onClick?: VoidCallback;
  } = $props();
</script>

<a class="list" href={route} onclick={onClick}>
  {#if children}
    {@render children()}
  {/if}
</a>

<style lang="scss">
  .list {
    display: flex;
    flex-direction: column;
    text-decoration: none;
  }
</style>
