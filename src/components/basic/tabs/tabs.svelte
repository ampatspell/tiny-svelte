<script lang="ts">
  import type { Snippet } from 'svelte';
  import { setTabsContext, TabsContext } from './model.svelte';
  import { getter, options } from '$lib/utils/args';

  let {
    selected,
    onSelect,
    children
  }: {
    selected: string;
    onSelect: (id: string) => void;
    children: Snippet;
  } = $props();

  let context = new TabsContext(
    options({
      selected: getter(() => selected)
    })
  );

  setTabsContext(context);
</script>

<div class="tabs">
  <div class="header">
    {#each context.tabs as tab (tab)}
      <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
      <div class="tab" class:selected={context.selected === tab} onclick={() => onSelect(tab.id)}>{tab.name}</div>
    {/each}
  </div>
  <div class="content">
    {@render children()}
  </div>
</div>

<style lang="scss">
  .tabs {
    flex: 1;
    display: flex;
    flex-direction: column;
    > .header {
      display: flex;
      flex-direction: row;
      border-bottom: 1px solid fade-out(#000, 0.95);
      user-select: none;
      padding: 5px;
      > .tab {
        padding: 5px 10px;
        text-align: center;
        color: fade-out(#000, 0.5);
        border-radius: 3px;
        &.selected {
          background: fade-out(#000, 0.96);
          color: #000;
        }
      }
    }
    > .content {
      flex: 1;
      display: flex;
      flex-flow: column;
    }
  }
</style>
