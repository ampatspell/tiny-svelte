<script lang="ts" generics="T">
  import { isTruthy } from '$lib/utils/array';

  import type { Snippet } from 'svelte';
  import Item from '$components/basic/list/item.svelte';
  import List from '$components/basic/list/list.svelte';

  let {
    all,
    selected,
    onSelect,
    children,
  }: {
    all: T[];
    selected?: T | T[];
    onSelect: (model?: T) => void;
    children: Snippet<[model: T]>;
  } = $props();

  let asArray = $derived.by(() => {
    if (Array.isArray(selected)) {
      return selected;
    }
    return [selected].filter(isTruthy);
  });
</script>

<div class="content">
  <List onClick={() => onSelect()}>
    {#each all as model (model)}
      <Item isSelected={asArray.includes(model)} onClick={() => onSelect(model)}>
        <div class="item">
          {@render children(model)}
        </div>
      </Item>
    {/each}
  </List>
</div>

<style lang="scss">
  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .item {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
  }
</style>
