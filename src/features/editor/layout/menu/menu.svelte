<script lang="ts">
  import Item from './item.svelte';
  import { Items } from './model';

  let {
    top,
    bottom,
  }: {
    top: Items;
    bottom: Items;
  } = $props();
</script>

<div class="menu">
  <div class="items top">
    {#each top.all as item (item)}
      <Item {item} />
    {/each}
  </div>
  <div class="items bottom">
    {#each bottom.all as item (item)}
      <Item {item} />
    {/each}
  </div>
</div>

<style lang="scss">
  .menu {
    background: fade-out(#000, 0.98);
    border-right: 1px solid fade-out(#000, 0.95);
    display: flex;
    flex-direction: column;
    user-select: none;
    > .items {
      &.top {
        flex: 1;
      }
    }
  }
</style>
