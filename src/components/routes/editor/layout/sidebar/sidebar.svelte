<script lang="ts">
  import Home from '$icons/mingcute-left-fill.svelte';
  import Editor from '$icons/mingcute-game-2-line.svelte';
  import Mushroom from '$icons/mingcute-mushroom-line.svelte';
  import Item from './item.svelte';
  import { createItems } from './model';
  import Activated from '$components/basic/activated.svelte';
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
    <div class="content"><Activated /></div>
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
    bottom: 10px;
    left: 50px;
    box-shadow: 0 1px 8px 0 fade-out(#000, 0.95);
    > .content {
      width: 600px;
      max-height: 40vh;
      overflow-y: scroll;
    }
  }
</style>
