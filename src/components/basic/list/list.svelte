<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    route,
    children
  }: {
    children?: Snippet;
    route?: string;
  } = $props();
</script>

<div class="list">
  <a class="content" href={route}>
    {#if children}
      {@render children()}
    {/if}
  </a>
</div>

<style lang="scss">
  .list {
    display: flex;
    flex-direction: column;
    > .content {
      display: flex;
      flex-direction: column;
      text-decoration: none;
    }
  }
</style>
