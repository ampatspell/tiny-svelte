<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    title,
    children,
  }: {
    title?: string;
    children: Snippet;
  } = $props();
</script>

<div class="section">
  {#if title}
    <div class="title">{title}</div>
  {/if}
  <div class="content">
    {@render children()}
  </div>
</div>

<style lang="scss">
  .section {
    display: flex;
    flex-direction: column;
    > .title {
      padding: 20px 10px 10px 10px;
      color: fade-out(#000, 0.5);
      border-bottom: 1px solid fade-out(#000, 0.97);
    }
    &:first-child {
      border-top: none;
    }
  }
</style>
