<script lang="ts" generics="T">
  import { clickOutside } from '$lib/utils/use-click-outside.svelte';
  import type { Snippet } from 'svelte';
  import ChevronDown from '$icons/lucide-chevron-down.svelte';

  let {
    selected,
    items,
    onSelect: _onSelect,
    item,
    placeholder,
  }: {
    selected?: T;
    items: T[];
    onSelect: (model?: T) => void;
    item: Snippet<[T]>;
    placeholder?: Snippet;
  } = $props();

  let isOpen = $state(false);

  let onToggle = () => {
    isOpen = !isOpen;
  };

  let onClose = () => {
    isOpen = false;
  };

  let onSelect = (e: Event, model?: T) => {
    e.stopPropagation();
    _onSelect(model);
    onClose();
  };
</script>

{#snippet content(model: T | undefined)}
  <div class="content" class:selected={model === selected}>
    {#if model}
      {@render item(model)}
    {:else if placeholder}
      {@render placeholder()}
    {/if}
  </div>
{/snippet}

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="dropdown" onclick={onToggle}>
  <div class="selected">
    {@render content(selected)}
    <div class="accessories">
      <ChevronDown />
    </div>
  </div>
  {#if isOpen}
    <div class="items" use:clickOutside={onClose}>
      {#each items as model (model)}
        <div class="item" onclick={(e) => onSelect(e, model)}>
          {@render content(model)}
        </div>
      {/each}
    </div>
  {/if}
</div>

<style lang="scss">
  .dropdown {
    user-select: none;
    > .selected {
      display: flex;
      flex-direction: row;
      border-radius: 3px;
      color: #000;
      border: 1px solid #eee;
      height: 27px;
      padding: 0 10px;
      > .accessories {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        :global(> svg) {
          $s: 15px;
          width: $s;
          height: $s;
        }
      }
    }
    position: relative;
    > .items {
      position: absolute;
      background: #fff;
      top: 26px;
      left: 0;
      right: 0;
      border-radius: 3px;
      border: 1px solid #eee;
      padding: 0 10px;
      display: flex;
      flex-direction: column;
      > .item {
        height: 27px;
        display: flex;
        flex-direction: row;
        align-items: center;
      }
    }
  }

  .content {
    flex: 1;
    display: flex;
    flex-direction: row;
    align-items: center;
    &.selected {
      font-weight: 600;
    }
  }
</style>
