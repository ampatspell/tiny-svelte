<script lang="ts">
  import type { EmptyObject } from '$lib/types/types';
  import { classes } from '$lib/utils/classes';
  import type { ComponentType, SvelteComponent } from 'svelte';

  let {
    type,
    icon,
  }: {
    type?: 'regular' | 'warning';
    icon: ComponentType<SvelteComponent<EmptyObject>>;
  } = $props();
</script>

<div class={classes('icon', `type-${type ?? 'regular'}`)}>
  <svelte:component this={icon} />
</div>

<style lang="scss">
  .icon {
    color: fade-out(#000, 0.3);
    :global(> svg) {
      width: 16px;
    }
    &.type-warning {
      color: #e63946;
    }
  }
</style>
