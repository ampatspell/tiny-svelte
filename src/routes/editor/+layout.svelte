<script lang="ts">
  import Sidebar from '$lib/editor/layout/sidebar/sidebar.svelte';
  import type { Snippet } from 'svelte';

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
