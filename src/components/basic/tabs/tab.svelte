<script lang="ts">
  import { type Snippet } from 'svelte';
  import { getTabsContext } from './model.svelte';
  import { getter, options } from '$lib/utils/args';

  let {
    id,
    name,
    children
  }: {
    id: string;
    name: string;
    children: Snippet;
  } = $props();

  let context = getTabsContext();

  $effect(() => {
    return context.registerTab(
      options({
        id: getter(() => id),
        name: getter(() => name)
      })
    );
  });

  let tab = $derived(context.tab(id));
  let isSelected = $derived(context.selected === tab);
</script>

{#if isSelected}
  {@render children()}
{/if}
