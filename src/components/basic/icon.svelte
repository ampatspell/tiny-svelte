<script lang="ts">
  import type { EmptyObject } from '$lib/types/types';
  import { classes } from '$lib/utils/classes';
  import type { ComponentType, SvelteComponent } from 'svelte';

  let {
    type,
    icon,
    size,
  }: {
    type?: 'regular' | 'warning';
    size: number;
    icon: ComponentType<SvelteComponent<EmptyObject>>;
  } = $props();
</script>

<div class={classes('icon', `type-${type ?? 'regular'}`)} style:--size="{size}px">
  <svelte:component this={icon} />
</div>

<style lang="scss">
  .icon {
    color: fade-out(#000, 0.3);
    :global(> svg) {
      width: var(--size);
      height: var(--size);
    }
    &.type-warning {
      color: #e63946;
    }
  }
</style>
