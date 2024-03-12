<script lang="ts">
  import type { Snippet } from 'svelte';
  import Sidebar from './sidebar/sidebar.svelte';

  let { children } = $props<{
    children: Snippet;
  }>();
</script>

<div class="layout">
  <Sidebar />
  <div class="content">
    {@render children()}
  </div>
</div>

<style lang="scss">
  .layout {
    flex: 1;
    display: flex;
    flex-direction: row;
    > .content {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
  }
</style>
