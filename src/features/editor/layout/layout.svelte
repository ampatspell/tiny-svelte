<script lang="ts">
  import { createVerticalMenuItems } from '$features/editor/layout/menu/model';
  import type { Snippet } from 'svelte';
  import Home from '$icons/lucide-chevron-left.svelte';
  import Editor from '$icons/lucide-gamepad.svelte';
  import Projects from '$icons/lucide-book-heart.svelte';
  import Code from '$icons/lucide-code-xml.svelte';
  import Activated from '$components/basic/activated.svelte';
  import Menu from './menu/menu.svelte';

  let { children }: { children: Snippet } = $props();

  let top = createVerticalMenuItems([
    { icon: Home, route: '/' },
    { icon: Editor, route: '/editor' },
    { icon: Projects, route: '/editor/projects' }
  ]);

  let activated = $state(false);
  let onActivated = () => {
    activated = !activated;
  };

  let bottom = createVerticalMenuItems([{ icon: Code, onClick: onActivated }]);
</script>

<div class="layout">
  <Menu {top} {bottom} />
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
      background: #fff;
    }
  }
</style>
