<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { ItemProps } from './model';

  let { isSelected, route, children } = $props<
    {
      children?: Snippet;
    } & ItemProps
  >();
</script>

<a class="item" href={route} class:selected={isSelected}>
  {#if children}
    {@render children()}
  {/if}
</a>

<style lang="scss">
  .item {
    display: flex;
    min-height: 44px;
    padding: 5px 10px;
    align-items: center;
    border-bottom: 1px solid fade-out(#000, 0.9);
    text-decoration: none;
    &:hover {
      background: fade-out(#000, 0.98);
    }
    &.selected {
      background: fade-out(#000, 0.96);
    }
  }
</style>
