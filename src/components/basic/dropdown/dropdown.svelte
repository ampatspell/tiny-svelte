<script lang="ts" generics="T">
  import Popup from './popup.svelte';

  import { PopupModel, popups } from '../popup/model.svelte';

  import type { Snippet } from 'svelte';
  import ChevronDown from '$icons/lucide-chevron-down.svelte';

  let {
    selected,
    items,
    item,
  }: {
    selected?: T;
    items: T[];
    item: Snippet<[T]>;
  } = $props();

  let element = $state<HTMLDivElement>();

  let open = $state<PopupModel>();
  let onToggle = () => {
    if (open) {
      open.close();
    } else {
      open = popups.open(Popup, { name: 'hello' }, element);
    }
  };
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
<div class="dropdown" onclick={onToggle} bind:this={element}>
  <div class="selected">
    <div class="content">
      {#if selected}
        {@render item(selected)}
      {/if}
    </div>
    <div class="accessories">
      <ChevronDown />
    </div>
  </div>
</div>

<style lang="scss">
  .dropdown {
    > .selected {
      display: flex;
      flex-direction: row;
      border-radius: 3px;
      color: #000;
      border: 1px solid #eee;
      height: 27px;
      padding: 0 10px;
      > .content {
        flex: 1;
        display: flex;
        flex-direction: row;
        align-items: center;
      }
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
  }
</style>
