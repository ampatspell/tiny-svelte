<script lang="ts">
  import { createItems } from '$components/basic/sidebar/model';
  import Sidebar from '$components/basic/sidebar/sidebar.svelte';
  import type { Snippet } from 'svelte';
  import Home from '$icons/mingcute-left-fill.svelte';
  import Editor from '$icons/mingcute-game-2-line.svelte';
  import Mushroom from '$icons/mingcute-mushroom-line.svelte';
  import CodeLine from '$icons/mingcute-code-line.svelte';
  import Activated from '$components/basic/activated.svelte';

  let { children }: { children: Snippet } = $props();

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

<div class="layout">
  <Sidebar {top} {bottom} />
  <div class="content">
    {@render children()}
  </div>
</div>

{#if activated}
  <div class="activated">
    <div class="content"><Activated /></div>
  </div>
{/if}

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
  .activated {
    position: fixed;
    bottom: 10px;
    left: 50px;
    box-shadow: 0 1px 8px 0 fade-out(#000, 0.95);
    > .content {
      width: 600px;
      max-height: 50vh;
      overflow-y: scroll;
    }
  }
</style>
