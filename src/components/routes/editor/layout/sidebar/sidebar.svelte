<script lang="ts">
  import Home from '$icons/mingcute-left-fill.svelte';
  import Editor from '$icons/mingcute-game-2-line.svelte';
  import Mushroom from '$icons/mingcute-mushroom-line.svelte';
  import Item from './item.svelte';
  import { createItems } from './model';
  import Activated from '$components/basic/activated.svelte';
  import { clickOutside } from '$lib/utils/use-click-outside.svelte';
  import CodeLine from '$icons/mingcute-code-line.svelte';

  let top = createItems([
    { icon: Home, route: '/' },
    { icon: Editor, route: '/editor' },
    { icon: Mushroom, route: '/editor/projects' }
  ]);

  let activated = $state(false);
  let onActivated = () => {
    activated = !activated;
  };

  let bottom = createItems([{ icon: CodeLine, onClick: onActivated }]);
</script>

<div class="sidebar">
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

{#if activated}
  <div class="activated">
    <div class="content" use:clickOutside={onActivated}><Activated /></div>
  </div>
{/if}

<style lang="scss">
  .sidebar {
    background: fade-out(#000, 0.98);
    border-right: 1px solid fade-out(#000, 0.95);
    display: flex;
    flex-direction: column;
    > .items {
      &.top {
        flex: 1;
      }
    }
  }
  .activated {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: fade-out(#000, 0.8);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    > .content {
      width: 600px;
      max-height: 80vh;
      background: #fff;
      border: 1px solid fade-out(#000, 0.98);
      box-shadow: 0 1px 5px 0 fade-out(#000, 0.9);
      overflow-y: scroll;
    }
  }
</style>
