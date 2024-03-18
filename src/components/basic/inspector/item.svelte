<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    title,
    children
  }: {
    title?: string;
    children: Snippet;
  } = $props();
</script>

<div class="item">
  {#if title}
    <div class="title">{title}</div>
  {/if}
  <div class="content">
    {@render children()}
  </div>
</div>

<style lang="scss">
  .item {
    display: flex;
    flex-direction: column;
    gap: 5px;
    border-bottom: 1px solid fade-out(#000, 0.97);
    padding: 10px;
    > .title {
      font-weight: 600;
    }
    > .content {
      display: flex;
      flex-direction: column;
    }
  }
</style>
