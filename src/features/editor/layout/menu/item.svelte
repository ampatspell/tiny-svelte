<script lang="ts">
  import type { Item } from './model';

  let {
    item
  }: {
    item: Item;
  } = $props();
</script>

<a class="item" class:current={item.isCurrent} href={item.route} onclick={item.onClick}>
  <svelte:component this={item.icon} />
</a>

<style lang="scss">
  .item {
    $s: 40px;
    width: $s;
    height: $s;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    :global(> svg) {
      $s: 20px;
      width: $s;
      height: $s;
    }
    &:hover {
      background: fade-out(#000, 0.97);
    }
    &.current {
      background: fade-out(#000, 0.95);
    }
  }
</style>
