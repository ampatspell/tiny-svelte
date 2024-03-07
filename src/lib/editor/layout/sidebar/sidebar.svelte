<script lang="ts">
  import Home from '$lib/icons/mingcute-left-fill.svelte';
  import Editor from '$lib/icons/mingcute-game-2-line.svelte';
  import Mushroom from '$lib/icons/mingcute-mushroom-line.svelte';
  import Item from './item.svelte';
  import { createItems } from './model';

  let items = createItems([
    { icon: Home, route: '/' },
    { icon: Editor, route: '/editor' },
    { icon: Mushroom, route: '/editor/assets' }
  ]);
</script>

<div class="sidebar">
  {#each items.all as item (item)}
    <Item {item} />
  {/each}
</div>

<style lang="scss">
  .sidebar {
    background: fade-out(#000, 0.98);
    border-right: 1px solid fade-out(#000, 0.95);
  }
</style>
